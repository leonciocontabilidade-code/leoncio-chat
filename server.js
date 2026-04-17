const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Aumentar limite de payload para imagens
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Dados em memória
let users = new Map();
let messages = [];
let channels = new Map();
let connectedUsers = new Map();
let company = {
  name: 'Sua Empresa',
  cnpj: '00.000.000/0000-00',
  address: 'Endereço da empresa',
  logo: 'https://via.placeholder.com/200?text=Logo',
  phone: '(11) 0000-0000',
  email: 'contato@empresa.com.br',
  website: 'www.empresa.com.br'
};

// Inicializar canais padrão
const defaultChannels = ['geral', 'fiscal', 'contabil', 'rh'];
defaultChannels.forEach(ch => {
  channels.set(ch, { name: ch, created: new Date() });
});

// Usuários de teste
const testUsers = [
  { id: '1', email: 'leoncio@contabil.com', password: 'senha123', role: 'admin', name: 'Leoncio' },
  { id: '2', email: 'contador@contabil.com', password: 'senha123', role: 'user', name: 'Contador' },
  { id: '3', email: 'fiscal@contabil.com', password: 'senha123', role: 'user', name: 'Fiscal' }
];

// Inicializar usuários de teste com hash
testUsers.forEach(user => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  users.set(user.email, { ...user, password: hashedPassword });
});

// ===== ROUTES =====

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password and name required' });
  }

  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    role: 'user',
    avatar: `https://i.pravatar.cc/150?u=${email}`
  };

  users.set(email, user);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, email, name, role: user.role } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = users.get(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      contact: user.contact || '',
      bio: user.bio || ''
    }
  });
});

app.put('/api/profile', (req, res) => {
  const { email, name, contact, bio, avatar } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const user = users.get(email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name) user.name = name;
  if (contact) user.contact = contact;
  if (bio) user.bio = bio;
  if (avatar) user.avatar = avatar;

  users.set(email, user);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      contact: user.contact || '',
      bio: user.bio || ''
    }
  });
});

app.get('/api/profile/:email', (req, res) => {
  const { email } = req.params;
  const user = users.get(email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      contact: user.contact || '',
      bio: user.bio || ''
    }
  });
});

// ===== EMPRESA ROUTES =====

app.get('/api/company', (req, res) => {
  res.json({ company });
});

app.put('/api/company', (req, res) => {
  const { name, cnpj, address, logo, phone, email, website } = req.body;

  if (!name || !cnpj) {
    return res.status(400).json({ error: 'Name and CNPJ required' });
  }

  company = {
    name: name || company.name,
    cnpj: cnpj || company.cnpj,
    address: address || company.address,
    logo: logo || company.logo,
    phone: phone || company.phone,
    email: email || company.email,
    website: website || company.website
  };

  res.json({ company });
});

app.get('/api/channels', (req, res) => {
  const channelList = Array.from(channels.values()).map(ch => ({
    name: ch.name,
    id: ch.name
  }));
  res.json(channelList);
});

app.get('/api/messages/:channel', (req, res) => {
  const { channel } = req.params;
  const channelMessages = messages.filter(m => m.channel === channel);
  res.json(channelMessages);
});

// ===== SOCKET.IO =====

io.on('connection', (socket) => {
  socket.on('user_join', (data) => {
    const { userId, email, name } = data;
    connectedUsers.set(socket.id, { userId, email, name });
    io.emit('user_connected', {
      count: connectedUsers.size,
      user: { email, name }
    });
  });

  socket.on('join_channel', (channel) => {
    socket.join(channel);
    io.to(channel).emit('user_joined_channel', { channel });
  });

  socket.on('send_message', (data) => {
    const { text, channel, email, name } = data;

    if (!text || !channel) {
      socket.emit('error', 'Text and channel required');
      return;
    }

    const message = {
      id: Date.now().toString(),
      text,
      channel,
      email,
      name,
      timestamp: new Date(),
      avatar: `https://i.pravatar.cc/150?u=${email}`
    };

    messages.push(message);
    io.to(channel).emit('new_message', message);
  });

  socket.on('typing', (data) => {
    const { channel, name } = data;
    socket.to(channel).emit('user_typing', { name });
  });

  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);
    if (user) {
      io.emit('user_disconnected', {
        count: connectedUsers.size,
        user: user.name
      });
    }
  });
});

// ===== START SERVER =====

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const HOST = '0.0.0.0';
  server.listen(PORT, HOST, () => {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';

    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }

    console.log(`\n🚀 Server running on:`);
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Network:  http://${localIp}:${PORT}`);
    console.log(`\n✅ Use the Network URL to access from other machines\n`);
  });
}

module.exports = { app, io, server };
