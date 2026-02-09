const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('O servidor está online e conversando com o Acode!');
});

app.listen(3000, () => {
  console.log('------------------------------------');
  console.log('SERVIDOR RODANDO NA PORTA 3000');
  console.log('------------------------------------');
});
