# tasks-api

API REST de tarefas (Node.js + Express) com banco PostgreSQL, criada para demonstrar um
workflow de **Integração Contínua (CI)** com GitHub Actions, seguindo o roteiro
_"Integração Contínua (CI) de aplicações WEB com GitHub Actions"_.

Aluno: Leonardo da Silva Irineu — 4º DSM, Fatec Jacareí

## Endpoints

| Método | Rota         | Descrição        |
| ------ | ------------ | ---------------- |
| GET    | `/health`    | Health check     |
| GET    | `/tasks`     | Lista tarefas    |
| GET    | `/tasks/:id` | Busca uma tarefa |
| POST   | `/tasks`     | Cria `{title}`   |
| PUT    | `/tasks/:id` | Atualiza         |
| DELETE | `/tasks/:id` | Remove           |

## Rodando localmente

```bash
docker compose up -d db          # PostgreSQL
npm ci
npm run test:unit
npm run test:integration         # usa DATABASE_URL (padrão: postgres://test:test@localhost:5432/app_test)
npm start
```

## Pipeline (`.github/workflows/ci.yml`) — gatilho: Pull Request para `main`

| Ordem | Job        | O que faz                                                |
| ----- | ---------- | -------------------------------------------------------- |
| 1     | `lint`     | Prettier (formatação) + ESLint (análise estática)        |
| 2     | `security` | `npm audit` + CodeQL (SAST); ESLint-plugin-security no 1 |
| 3     | `build`    | Empacota com esbuild e publica o artefato `dist`         |
| 4     | `test`     | Testes unitários e de integração (service Postgres 16)   |
| 5     | `image`    | Build da imagem Docker (sem publicar)                    |

Cada job usa `needs` do anterior (fail fast).

## Como disparar o CI

```bash
git init && git add . && git commit -m "feat: projeto inicial" && git branch -M main
git remote add origin https://github.com/SEU_USUARIO/tasks-api.git
git push -u origin main
git checkout -b feature/ci-demo
# faça uma alteração qualquer
git commit -am "feat: demo CI" && git push -u origin feature/ci-demo
# abra o Pull Request para main no GitHub
```

> CodeQL é gratuito em repositórios públicos. Em repositório privado exige GitHub Code Security.
