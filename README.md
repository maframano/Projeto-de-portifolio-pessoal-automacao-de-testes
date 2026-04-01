# API EBD - Escola Bíblica Dominical

## O que é o projeto?
API REST para acompanhamento de frequência de alunos, professores e relatórios da Escola Bíblica Dominical, com autenticação JWT e persistência em arquivos CSV.

## Como instalar e rodar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz com:
   ```env
   JWT_SECRET=sua_chave_secreta
   PORT=3000
   ```
4. Execute o projeto:
   ```bash
   npm start
   ```

## Variáveis de ambiente necessárias
- `JWT_SECRET`: chave secreta para geração e validação do token JWT
- `PORT`: porta do servidor (opcional, padrão 3000)

## Estrutura de pastas
```
projeto/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── middlewares/
├── data/              # arquivos CSV
├── docs/              # documentação Swagger
├── README.md
└── package.json
```

## Descrição das rotas principais

- `POST /auth/login` — Login da secretária (retorna JWT)
- `GET/POST /alunos` — Listar/cadastrar alunos
- `GET/POST /professores` — Listar/cadastrar professores
- `GET/POST /secretaria` — Listar/cadastrar secretária
- `GET/POST /presencas` — Listar/registrar presenças
- `GET /relatorios/presencas/domingo/:data` — Presença por classe em um domingo
- `GET /relatorios/presencas/trimestre/:ano/:trimestre` — Presença acumulada por classe no trimestre
- `GET /relatorios/vencedores/trimestre/:ano/:trimestre` — Classe vencedora e aluno ganhador por classe
- `GET /relatorios/aniversariantes` — Lista de aniversariantes

## Documentação Swagger
Acesse a documentação completa em `/docs/swagger.json`.

http://localhost:3000/swagger-ebd