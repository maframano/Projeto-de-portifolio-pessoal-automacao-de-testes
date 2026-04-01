# Contexto para Geração da API - Escola Bíblica Dominical (EBD)

---

## 🎯 Objetivo

Criar uma API REST para acompanhamento de frequência de alunos na Escola Bíblica Dominical (EBD).

---

## 📋 Funcionalidades da API

- Registro de aluno
- Registro de professor
- Registro de secretária
- Login de secretária (autenticação)
- Registro de presença por domingo
- Quantidade geral de alunos presentes por domingo
- Aluno ganhador por classe (maior número de presenças no trimestre)
- Classificação de sala vencedora por domingo
- Classificação de sala vencedora por trimestre
- Lista de presença por classe
- Lista de aniversariantes (alunos e professores, ordenada por mês)

---

## 🏫 Regras de Negócio

### Classes
As classes devem ser definidas com os seguintes identificadores fixos e regras de alocação automática no momento do cadastro do aluno:

| Identificador     | Nome                   | Regra de alocação                                      |
|-------------------|------------------------|--------------------------------------------------------|
| `abraao`          | Classe Abraão          | Homens casados com idade acima de 30 anos              |
| `sarah`           | Classe Sarah           | Mulheres casadas com idade acima de 30 anos            |
| `peniel`          | Classe Peniel          | Homens e mulheres solteiros, qualquer idade            |
| `mensageiros`     | Classe Mensageiros da Fé | Qualquer sexo, idade entre 15 e 17 anos              |
| `samuel`          | Classe Samuel          | Qualquer sexo, idade entre 12 e 14 anos               |
| `cordeirinhos`    | Classe Cordeirinhos    | Qualquer sexo, idade entre 4 e 11 anos                |

> ⚠️ A classe do aluno deve ser determinada **automaticamente** pelo sistema com base nas regras acima. O campo `classe_id` não deve ser preenchido manualmente pelo usuário.

### Trimestre
- Cada trimestre é composto por **13 domingos**
- A presença é registrada individualmente por domingo
- Ao final do trimestre, o sistema soma o total de presenças de cada aluno

### Presença por Domingo
- Todo domingo, cada aluno deve ter sua presença ou falta registrada
- Ao final de cada domingo, o sistema deve somar a presença de todas as salas e exibir a **quantidade geral de presentes naquele domingo**

### Classe Vencedora
- A vencedora é definida pelo **percentual de presença** (não pela quantidade absoluta)
- Cálculo: `(alunos presentes / total de alunos matriculados na classe) * 100`
- A classe com **maior percentual** vence o domingo
- O mesmo critério se aplica ao vencedor do trimestre (soma dos 13 domingos)

### Aluno Ganhador por Classe
- Cada classe deve apresentar o aluno com **maior número de presenças** ao longo do trimestre

### Lista de Aniversariantes
- Deve incluir **alunos e professores**
- Ordenada por mês (janeiro a dezembro)
- Exibir nome completo e data de aniversário

---

## 🔐 Autenticação

- Apenas a **secretária** pode acessar as funcionalidades da API
- O login deve retornar um **token JWT** com tempo de expiração
- O **Middleware** deve validar o token JWT em **todas as rotas**, exceto a rota `POST /auth/login`
- A senha da secretária deve ser armazenada com **hash bcrypt** no arquivo `secretaria.csv`
- Implemente o middleware de autenticação em um arquivo separado: `src/middlewares/auth.middleware.js`

---

## 🗂️ Estrutura de Pastas

```
projeto/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── middlewares/
├── data/              ← arquivos CSV ficam aqui
├── docs/              ← arquivo swagger.json ou swagger.yaml
├── README.md
└── package.json
```

---

## 💾 Estrutura de Armazenamento em CSV

> Todos os dados devem ser persistidos **exclusivamente em arquivos `.csv`** na pasta `/data`. Não utilize banco de dados.

Utilize a biblioteca `csv-parser` para leitura e `csv-writer` para escrita. Toda operação de escrita deve preservar os registros anteriores (reescrita completa do arquivo atualizado). Datas devem seguir o formato `YYYY-MM-DD`.

### `data/alunos.csv`
```
id, nome, data_nascimento, sexo, estado_civil, telefone, email, classe_id, data_matricula, ativo
```

### `data/professores.csv`
```
id, nome, data_nascimento, sexo, telefone, email, classe_id, data_cadastro
```

### `data/secretaria.csv`
```
id, nome, email, senha_hash
```
> A senha deve ser armazenada como hash bcrypt, nunca como texto puro.

### `data/presencas.csv`
```
id, aluno_id, classe_id, data_domingo, trimestre, ano, presente
```
> O campo `presente` deve ser `true` ou `false`. O campo `data_domingo` deve estar no formato `YYYY-MM-DD`.

### `data/trimestres.csv`
```
id, ano, numero_trimestre, data_inicio, data_fim, domingos_realizados
```

---

## 🛠️ Stack Técnica

- **Runtime:** Node.js
- **Framework:** Express.js
- **Autenticação:** JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **Persistência:** arquivos `.csv` com `csv-parser` e `csv-writer`
- **Documentação:** Swagger (gerar arquivo `docs/swagger.json` ou `docs/swagger.yaml`)

---

## 📄 Documentação e README

- A documentação da API deve ser gerada com **Swagger** e salva como arquivo em `/docs`
- Crie um arquivo `README.md` descrevendo:
  - O que é o projeto
  - Como instalar e rodar
  - Variáveis de ambiente necessárias (ex: `JWT_SECRET`)
  - Estrutura de pastas
  - Descrição das rotas principais

---

## 📊 Observação para Relatórios e Gráficos

As rotas de relatório devem retornar os dados em **formato JSON estruturado** para permitir a criação de gráficos externos. Exemplos:

- `GET /relatorios/presencas/domingo/:data` → retorna presença por classe naquele domingo
- `GET /relatorios/presencas/trimestre/:ano/:trimestre` → retorna presença acumulada por classe no trimestre
- `GET /relatorios/vencedores/trimestre/:ano/:trimestre` → retorna a classe vencedora e o aluno ganhador por classe

---

## ✅ Resumo das Regras para a IA

1. Divida a API em camadas: `routes`, `controllers`, `services` e `models`
2. Armazene todos os dados em arquivos `.csv` na pasta `/data`
3. Use `express` para construir a API REST
4. O campo `classe_id` do aluno deve ser atribuído automaticamente pelo sistema
5. A autenticação deve ser implementada como middleware JWT
6. A senha da secretária deve usar hash bcrypt
7. Gere a documentação Swagger como arquivo em `/docs`
8. Crie um `README.md` completo
9. O trimestre tem exatamente 13 domingos
10. A classe vencedora é definida por percentual de presença, não quantidade absoluta
11. Adicione um endpoint para rendenizar o swagger