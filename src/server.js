const app = require('./app');
const { migrate } = require('./db');

const port = process.env.PORT || 3000;

migrate()
  .then(() => {
    app.listen(port, () => console.log(`API rodando na porta ${port}`));
  })
  .catch((err) => {
    console.error('Falha ao migrar o banco', err);
    process.exit(1);
  });
