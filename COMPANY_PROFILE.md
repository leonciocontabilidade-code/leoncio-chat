# 🏢 Perfil da Empresa

## O que é?

O perfil da empresa permite centralizar informações importantes da sua contabilidade que aparecem em todo o app:

- 📷 **Logo** - Imagem/marca da empresa
- 📝 **Nome** - Nome da empresa
- 🆔 **CNPJ** - Número do CNPJ
- 📍 **Endereço** - Localização completa
- 📞 **Telefone** - Contato principal
- 📧 **Email** - Email de contato
- 🌐 **Website** - Site da empresa

---

## 📋 Como Usar

### 1️⃣ Ver Dados da Empresa

- Clique no **logo + nome** no topo da barra lateral
- Uma janela abrirá mostrando todos os dados da empresa

### 2️⃣ Editar Dados (ADMIN APENAS)

**Apenas o usuário ADMIN pode editar:**

1. Clique no logo/nome no topo (sidebar)
2. Se você for admin, um botão **"Salvar"** aparecerá
3. Edite os campos que desejar
4. Clique em **"Salvar"**

### 3️⃣ Mudar Logo

1. No modal de empresa, clique em **"Escolher Logo"**
2. Selecione a imagem do seu computador
3. A preview atualizará
4. Clique em **"Salvar"** para confirmar

---

## 👥 Permissões

| Ação | Admin | Usuário |
|------|-------|---------|
| Ver dados | ✅ | ✅ |
| Editar dados | ✅ | ❌ |
| Mudar logo | ✅ | ❌ |
| Mudar nome | ✅ | ❌ |

---

## 🔧 Dados Padrão

Quando o app inicia, vem com dados padrão:

```javascript
{
  name: 'Sua Empresa',
  cnpj: '00.000.000/0000-00',
  address: 'Endereço da empresa',
  logo: 'https://via.placeholder.com/200?text=Logo',
  phone: '(11) 0000-0000',
  email: 'contato@empresa.com.br',
  website: 'www.empresa.com.br'
}
```

---

## 📱 Onde Aparece?

- ✅ Topo da sidebar (logo + nome + CNPJ)
- ✅ Modal de empresa (clicando no logo)
- ✅ Futuro: Footer do app
- ✅ Futuro: Mensagens do sistema

---

## 🎯 Próximas Melhorias

- [ ] Banco de dados (dados persistem)
- [ ] Upload de logo sem base64
- [ ] Mais campos (inscrição estadual, razão social, etc)
- [ ] Mostrar empresa em emails/relatórios
- [ ] Multi-empresa (se houver filiais)

---

## 🚀 API Endpoints

### Ver dados da empresa
```bash
GET /api/company
```

Retorna:
```json
{
  "company": {
    "name": "Sua Empresa",
    "cnpj": "00.000.000/0000-00",
    "address": "Endereço",
    "logo": "data:image/...",
    "phone": "(11) 0000-0000",
    "email": "contato@empresa.com.br",
    "website": "www.empresa.com.br"
  }
}
```

### Atualizar dados (ADMIN)
```bash
PUT /api/company
Content-Type: application/json

{
  "name": "Nova Empresa",
  "cnpj": "11.222.333/0001-81",
  "address": "Novo endereço",
  "logo": "data:image/...",
  "phone": "(11) 9999-9999",
  "email": "novo@empresa.com.br",
  "website": "www.novaempresa.com.br"
}
```

---

## 💡 Dica

O logo da empresa fica salvo **em memória**. Quando o servidor reinicia, volta aos dados padrão.

**Para produção:** Integre com banco de dados (MongoDB/PostgreSQL) para persistir os dados!

---

**Equipe de sua empresa organizada e profissional!** 🎉
