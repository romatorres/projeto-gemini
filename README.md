O que foi feito até agora:

1.  Configuração do Projeto Next.js:

    - Um projeto Next.js foi configurado com TypeScript, Tailwind CSS para estilização, e Shadcn UI para componentes de interface.
    - Prisma foi integrado como ORM (Object-Relational Mapper) usando SQLite como banco de dados. O esquema do Prisma (prisma/schema.prisma) foi definido com um modelo User que inclui email,
      password e um campo role (string, para compatibilidade com SQLite) com valor padrão "USER".
    - Zustand foi configurado como gerenciador de estados para o frontend.

2.  Sistema de Autenticação:

    - APIs de Registro e Login: Foram criadas rotas de API (/api/auth/register e /api/auth/login) para registrar novos usuários (com bcryptjs para hash de senhas) e para realizar o login,
      gerando um JSON Web Token (JWT). O role do usuário é incluído neste token.
    - Páginas de Frontend: Criadas páginas de Login (/login) e Registro (/register) que interagem com as APIs de autenticação.
    - Gerenciamento de Token: O token JWT é armazenado em um cookie (usando js-cookie) após o login, o que permite que o middleware do Next.js o acesse para proteção de rotas.

3.  Proteção de Rotas e Controle de Acesso por Role:
    - Middleware (`middleware.ts`): Um middleware foi implementado na raiz do projeto. Ele intercepta requisições para rotas específicas (/dashboard/:path* e /admin/:path*).
      - Ele verifica a presença e validade do token JWT no cookie. Se o token for inválido ou ausente, redireciona para a página de login.
      - Para rotas como /admin/:path\*, ele decodifica o token e verifica se o role do usuário é "ADMIN". Se não for, redireciona para a dashboard.
    - Dashboard (`/dashboard`): Uma página de dashboard foi criada, que é uma rota protegida. Ela exibe uma "Área de Administrador" condicionalmente, apenas se o role do usuário logado for
      "ADMIN".

Como criar rotas protegidas ou não:

- Rotas Não Protegidas:

  - Qualquer rota que não esteja listada no matcher dentro do middleware.ts é considerada uma rota pública e pode ser acessada por qualquer pessoa, independentemente de estar logada ou não.
  - Exemplo: /, /login, /register.

- Rotas Protegidas (apenas autenticadas):

  - Para proteger uma rota para que apenas usuários logados possam acessá-la, você deve adicioná-la ao matcher no middleware.ts.
  - Exemplo: matcher: ['/dashboard/:path*']. Isso significa que qualquer URL que comece com /dashboard/ (incluindo /dashboard em si) exigirá um token JWT válido.

- Rotas Protegidas (por Role):
  - Para proteger uma rota para que apenas usuários com um role específico possam acessá-la, você também a adiciona ao matcher no middleware.ts.
  - Dentro da função middleware, você adiciona uma lógica condicional que verifica o role do usuário (obtido do token decodificado) e redireciona se o role não for o esperado.
  - Exemplo: matcher: ['/admin/:path*'] e a lógica dentro do middleware:

1 if (request.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
2 return NextResponse.redirect(new URL('/dashboard', request.url)); // Redireciona se não for admin
3 }

       * Você pode criar uma página src/app/admin/page.tsx para testar essa rota.

Papel do Store do Zustand:

O store do Zustand (src/store/authStore.ts) desempenha um papel crucial no gerenciamento do estado de autenticação no frontend:

1.  Estado Global Centralizado: Ele armazena o token JWT e o role do usuário logado em um local centralizado. Isso evita a necessidade de "prop drilling" (passar props de autenticação por vários
    componentes aninhados).
2.  Acesso Fácil aos Componentes: Qualquer componente React pode "assinar" (subscribe) a este store e acessar o token e o role do usuário de forma reativa. Quando o estado no store muda, os
    componentes que o utilizam são automaticamente re-renderizados.
3.  Persistência de Sessão (no cliente):
    - Na inicialização, o store tenta ler o token do localStorage. Isso ajuda a manter o estado de login do usuário mesmo após um refresh da página (embora o middleware agora use cookies para a
      verificação inicial).
    - Quando o token é definido (após um login bem-sucedido), ele é salvo no localStorage e também no cookie (via js-cookie na página de login).
4.  Decodificação do Token: O store usa jwt-decode para extrair o role do token JWT e armazená-lo junto com o token. Isso permite que a interface do usuário reaja ao role do usuário (como a "Área
    de Administrador" na dashboard).
5.  Ações para Modificar o Estado: Ele fornece funções (setToken, clearToken) que são as únicas formas de modificar o estado de autenticação. Isso garante que as mudanças de estado sejam
    previsíveis e controladas.

Em resumo, o Zustand atua como o "cérebro" da autenticação no lado do cliente, mantendo o estado do usuário logado acessível e atualizado em toda a aplicação.
