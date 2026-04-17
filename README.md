# Chat App - Aplicação de Chat para Contábil

MVP funcional de chat em tempo real com autenticação, canais e testes automatizados.

## 📦 Estrutura do Projeto

```
chat-app/
├── server.js           # Backend (Express + Socket.IO)
├── server.test.js      # Testes unitários
├── public/
│   └── index.html      # Frontend (HTML + CSS + JS)
├── package.json        # Dependências
├── .env                # Configurações
├── .gitignore          # Git ignore
└── README.md           # Este arquivo
```

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
cd chat-app
npm install
```

### 2. Iniciar Servidor

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em: **http://localhost:3000**

### 3. Abrir no Navegador

```
http://localhost:3000
```

## 🧪 Testes

### Rodar Testes (Uma vez)
```bash
npm test
```

### Rodar Testes em Modo Watch
```bash
npm run test:watch
```

## 👤 Usuários de Teste

| Email | Senha | Role | Nome |
|-------|-------|------|------|
| leoncio@contabil.com | senha123 | admin | Leoncio |
| contador@contabil.com | senha123 | user | Contador |
| fiscal@contabil.com | senha123 | user | Fiscal |

## ✨ Funcionalidades

- ✅ **Login/Registro** - Autenticação com JWT
- ✅ **Chat em Tempo Real** - Socket.IO bidireccional
- ✅ **4 Canais Padrão** - #geral, #fiscal, #contabil, #rh
- ✅ **Histórico de Mensagens** - Persistido em memória
- ✅ **Indicador de Digitação** - Mostra quando alguém está digitando
- ✅ **Perfil Personalizável** - Nome, foto, contato, bio
- ✅ **Upload de Avatar** - Escolha sua própria foto
- ✅ **Contato nas Mensagens** - Mostra telefone/WhatsApp do usuário
- ✅ **Interface Moderna** - Design profissional com gradientes
- ✅ **Responsivo** - Funciona em mobile, tablet, desktop
- ✅ **Testes Automatizados** - 17+ testes ✅ todos passando
- ✅ **Deploy Grátis** - Railway, Vercel ou Heroku

## 🎨 Como Usar o Novo Perfil

### Editar Seu Perfil
1. Clique na sua foto/nome na barra lateral esquerda
2. Ou clique no botão **⚙️ Perfil**
3. Atualize:
   - **Foto**: Clique em "Escolher Foto" para upload
   - **Nome**: Mude seu nome exibido no chat
   - **Contato**: Adicione telefone/WhatsApp
   - **Bio**: Descreva seu cargo ou função

### Ver Contato de Alguém
- O contato aparece ao lado do nome nas mensagens
- Você pode clicar no contato para copiar/ligar

---

## 🏗️ Arquitetura

### Backend

**Server.js** (Express + Socket.IO)
- `POST /api/register` - Registrar novo usuário
- `POST /api/login` - Autenticação
- `GET /api/channels` - Listar canais
- `GET /api/messages/:channel` - Histórico de mensagens

**Socket.IO Events**
- `user_join` - Usuário entrou no chat
- `join_channel` - Entrou em um canal
- `send_message` - Enviar mensagem
- `typing` - Indicador de digitação
- `disconnect` - Desconectar

### Frontend

**index.html** (HTML + CSS + Vanilla JS)
- Página de autenticação (login/registro)
- Página de chat com sidebar de canais
- Integração Socket.IO em tempo real
- Interface responsiva

## 🔐 Segurança

⚠️ **Antes de usar em produção:**

1. Mudar `JWT_SECRET` em `.env`:
```env
JWT_SECRET=sua-chave-super-segura-aqui
```

2. Integrar banco de dados (MongoDB/PostgreSQL)

3. Usar HTTPS (não HTTP)

4. Adicionar rate limiting para login

5. Validar e sanitizar todas as entradas

## 💾 Dados

Atualmente os dados são armazenados em **memória**:
- Reiniciam quando o servidor cai
- Ideal para desenvolvimento e testes
- Para produção: integrar MongoDB/PostgreSQL

## 📊 Cobertura de Testes

```
✅ Autenticação (5 testes)
  - Registrar usuário
  - Não registrar sem email
  - Não registrar sem senha
  - Não registrar usuário duplicado
  - Login com credenciais válidas
  
✅ Login (3 testes)
  - Falhar com senha errada
  - Falhar com usuário inexistente
  - Falhar sem email/senha

✅ Canais (2 testes)
  - Listar canais
  - Incluir canais padrão

✅ Mensagens (2 testes)
  - Retornar mensagens do canal
  - Retornar array vazio para canal vazio

✅ Arquivos Estáticos (1 teste)
  - Servir index.html

✅ Usuários de Teste (3 testes)
  - Login com leoncio
  - Login com contador
  - Login com fiscal
```

**Total: 16 testes** ✅

## 🎯 Próximas Evoluções

### 1. Upload de Arquivos
```javascript
socket.on('upload_file', (data) => {
  // Salvar arquivo
  // Notificar canal
})
```

### 2. Integração com Sistema Contábil
```javascript
socket.on('send_message', (data) => {
  if (data.text.startsWith('/consulta')) {
    // Buscar dados do API
    fetch('http://dominio.com/api/cliente/...')
  }
})
```

### 3. Notificações Automáticas
```javascript
// eSocial com erro → aviso no #fiscal
socket.emit('new_message', {
  text: '❌ eSocial S-1200 com erro',
  channel: 'fiscal',
  username: 'Sistema'
})
```

### 4. Integração Slack
```javascript
// Replicar mensagens para Slack
await slack.postMessage({
  channel: '#geral',
  text: message.text
})
```

### 5. Banco de Dados
```javascript
// MongoDB
const user = await User.findById(id)
const messages = await Message.find({ channel })
```

## 🌐 Deploy Online (SEM INSTALAR NADA)

Coloque o app online em **MINUTOS**:

### ⚡ Railway (Recomendado - Grátis)
```bash
npx railway login
npx railway up
```
Seu app estará em: `https://[seu-projeto]-production.up.railway.app`

### 📋 Ver Todas as Opções
Leia [DEPLOY.md](./DEPLOY.md) para Vercel, Heroku e outras opções.

---

## 🔧 Variáveis de Ambiente

```env
PORT=3000                           # Porta do servidor
JWT_SECRET=sua-chave-secreta       # Chave JWT
NODE_ENV=development               # development | production
```

## 📝 Endpoints da API

### Autenticação
- `POST /api/register` - Registrar novo usuário
- `POST /api/login` - Login com email/senha

### Perfil
- `GET /api/profile/:email` - Obter dados do perfil
- `PUT /api/profile` - Atualizar perfil (nome, foto, contato, bio)

### Canais
- `GET /api/channels` - Listar todos os canais

### Mensagens
- `GET /api/messages/:channel` - Histórico de mensagens do canal

### Socket.IO Events
- `user_join` - Usuário entra no chat
- `join_channel` - Entra em um canal
- `send_message` - Envia mensagem com contato
- `typing` - Indicador de digitação
- `user_typing` - Recebe indicador de digitação
- `user_connected` - Usuário conectado
- `user_disconnected` - Usuário desconectado

## 🚨 Logs & Debugging

```bash
# Ver logs do servidor
npm start

# Com nodemon (reinicia automaticamente)
npm run dev
```

## 📱 Responsividade

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (< 768px)

Sidebar desaparece em mobile para ganhar espaço.

## 🤝 Contribuindo

Para adicionar novas funcionalidades:

1. Criar branch: `git checkout -b feature/minha-feature`
2. Fazer commit: `git commit -m 'Add: minha feature'`
3. Push: `git push origin feature/minha-feature`
4. Criar PR

## 📄 Licença

MIT

## 🆘 Suporte

Para problemas, abra uma issue no repositório.

---

**Criado com ❤️ para a equipe contábil**
