# MT9 Notícias & Comércios

Portal de notícias digital focado na divulgação de informações sobre o Mato Grosso, fornecendo conteúdo relevante para a comunidade local.

## Visão Técnica do Projeto

### Stack Tecnológica

- **Frontend**: [Next.js 15](https://nextjs.org/) (React 19) com App Router
- **UI Framework**: [Mantine UI 8](https://v8.mantine.dev/) integrado com TailwindCSS 4
- **Estilização**: PostCSS com variáveis do Mantine e TailwindCSS
- **Backend**: API Routes do Next.js com Server Actions
- **Banco de Dados**: PostgreSQL gerenciado pelo Prisma ORM
- **Autenticação**: Sistema próprio baseado em `better-auth`
- **Armazenamento**: AWS S3 para uploads de mídia
- **Validação de Dados**: Zod com integração no Mantine Form
- **Data & Formatação**: date-fns v4

### Arquitetura do Sistema

```
src/
├── app/                    # Estrutura do App Router
│   ├── (dashboard)/        # Área administrativa (grupo de rota)
│   │   └── (admin)/        # Painel de administração (rota protegida)
│   │       ├── dashboard/  # Dashboard principal
│   │       ├── noticias/   # Gestão de notícias
│   │       └── publicidades/ # Gestão de anúncios
│   ├── (pages)/            # Páginas públicas (grupo de rota)
│   │   ├── sobre/          # Página Sobre
│   │   ├── contato/        # Página Contato
│   │   └── noticias/       # Visualização de notícias
│   │       └── [slug]/     # Página de notícia individual
│   ├── actions/            # Server Actions (operações do servidor)
│   │   ├── noticias/       # Ações para gerenciar notícias
│   │   └── publicidades/   # Ações para gerenciar anúncios
│   ├── api/                # API Routes
│   │   └── auth/           # Endpoints de autenticação
│   └── components/         # Componentes compartilhados
├── lib/                    # Utilitários e configurações
│   ├── auth.ts             # Configuração de autenticação
│   ├── prisma.ts           # Cliente do Prisma
│   └── schemas/            # Schemas Zod para validação
└── services/               # Serviços externos
    └── upload-s3.ts        # Integração com AWS S3
```

### Modelos de Dados (Prisma Schema)

#### Usuários e Autenticação

- **User**: Usuários do sistema com suporte a autenticação e roles
- **Session**: Gerenciamento de sessões com detecção de dispositivo
- **Account**: Provedor de autenticação (local/email)
- **Verification**: Sistema de verificação por tokens

#### Conteúdo

- **News**: Notícias publicadas no portal
  - Campos principais: título, slug, conteúdo, categoria, tags, imagem
  - Suporte a múltiplas categorias e pesquisa

- **Advertisement**: Sistema de anúncios
  - Campos principais: campanha, imagem, link, posicionamento
  - Suporte a diferentes posições na UI (HEADER, HIGHLIGHT)

### Funcionalidades Principais

1. **Área Pública**:
   - Página inicial com notícias em destaque e categorias
   - Visualização de notícias completas
   - Páginas institucionais (Sobre, Contato)
   - Suporte a compartilhamento e SEO

2. **Painel Administrativo**:
   - Login seguro para usuários admin
   - Gestão completa de notícias (CRUD)
   - Sistema de upload de imagens para o S3
   - Gerenciamento de anúncios/publicidades
   - Visualização de métricas e estatísticas

3. **Integrações**:
   - AWS S3 para armazenamento de imagens
   - Sistema de formulários com validação Zod

### Requisitos Técnicos

- Node.js v18.17.0 ou superior
- PostgreSQL 14 ou superior
- Bucket S3 configurado para uploads de mídia
- Variáveis de ambiente configuradas (ver `.env.example`)

## Instalação e Configuração

### Pré-requisitos

```bash
# Versões recomendadas
node -v  # v18.17.0 ou superior
npm -v   # v9.6.7 ou superior
```

### Setup do Ambiente

1. **Clone o repositório**

```bash
git clone https://github.com/David-Santosx/mt9-news-app.git
cd mt9-news-app
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` baseado no `.env.example`:

```
# Base de dados
DATABASE_URL="postgresql://user:password@localhost:5432/mt9news"
DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/mt9news"

# AWS S3
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=seu-bucket

# Auth
AUTH_SECRET=sua_chave_secreta
```

4. **Execute as migrações do Prisma**

```bash
npx prisma migrate dev
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

## Recursos Avançados

### Componentes UI Personalizados

O projeto utiliza uma combinação de componentes Mantine com personalizações específicas:

- **Carrossel de Notícias**: Implementado com Embla Carousel
- **Formulários**: Validação com Zod e feedback visual em tempo real
- **Cards de Notícia**: Componentes customizados com animações sutis
- **Display de Anúncios**: Espaço publicitário integrado

### Sistema de Autenticação

A autenticação utiliza o pacote `better-auth` com sessões persistentes e suporte a:

- Login/Logout
- Proteção de rotas por role
- Middleware para verificação de sessão

### Upload de Imagens

O sistema utiliza AWS S3 para armazenamento de imagens com:

- Upload direto para o S3
- Geração de URLs pré-assinadas
- Manipulação de imagens responsivas

## Deploy em Produção

Para deploy em produção, recomendamos:

1. Construir a aplicação:

```bash
npm run build
```

2. Executar em produção:

```bash
npm start
```

A aplicação pode ser facilmente deployada na Vercel, AWS Amplify ou qualquer plataforma que suporte Next.js.
