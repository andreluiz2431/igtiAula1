import express from 'express';
import studentModel from '../models/student.js';

const app = express();

// atividade 4 - depósito
app.patch('/deposito/:agencia/:conta/:valor', async (req, res) => {
  try {
    const student = await studentModel.findOneAndUpdate(
      { agencia: req.params.agencia, conta: req.params.conta },
      { $inc: { balance: req.params.valor } },
      { new: true }
    );

    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 5 - saque
app.patch('/saque/:agencia/:conta/:valor', async (req, res) => {
  try {
    const studentValidation = await studentModel.findOne({
      agencia: req.params.agencia,
      conta: req.params.conta,
    });

    if (studentValidation.balance < req.params.valor + 1) {
      res.end('Valor excede o saldo!');
      return;
    }

    const student = await studentModel.findOneAndUpdate(
      { agencia: req.params.agencia, conta: req.params.conta },
      { $inc: { balance: -req.params.valor - 1 } },
      { new: true }
    );

    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 6 - ver saldo
app.get('/saldo/:agencia/:conta', async (req, res) => {
  try {
    const student = await studentModel.find({
      agencia: req.params.agencia,
      conta: req.params.conta,
    });

    res.send(String(student[0].balance));
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 7 - excluir uma conta e retornar o número de contas ativas para esta agência
app.delete('/delConta/:agencia/:conta', async (req, res) => {
  try {
    const student = await studentModel.findOneAndDelete({
      agencia: req.params.agencia,
      conta: req.params.conta,
    });

    if (!student) {
      res.status(404).send('Documento não encontrado');
    }

    const student2 = await studentModel.find({
      agencia: req.params.agencia,
    });

    res.send(student2);

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 8 - tranferencia entre contas, com tarifa de 8 se for de agencias diferentes
app.patch('/transferencia/:origem/:destino/:valor', async (req, res) => {
  try {
    // ver se são da mesma agencia

    const validationOrigem = await studentModel.findOne({
      conta: req.params.origem,
    });

    const validationDestino = await studentModel.findOne({
      conta: req.params.destino,
    });

    if (validationOrigem.agencia === validationDestino.agencia) {
      const origem = await studentModel.findOneAndUpdate(
        { conta: req.params.origem },
        { $inc: { balance: -req.params.valor } },
        { new: true }
      );

      await studentModel.findOneAndUpdate(
        { conta: req.params.destino },
        { $inc: { balance: req.params.valor } },
        { new: true }
      );

      console.log(origem.balance);

      res.send(String(origem.balance));
    } else {
      const origem2 = await studentModel.findOneAndUpdate(
        { conta: req.params.origem },
        { $inc: { balance: -req.params.valor - 8 } },
        { new: true }
      );

      await studentModel.findOneAndUpdate(
        { conta: req.params.destino },
        { $inc: { balance: req.params.valor } },
        { new: true }
      );

      console.log(origem2.balance);

      res.send(String(origem2.balance));
      // se diferentes debitar 8 da conta origem
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 9 - media dos saldos de uma agencia
app.get('/mediaSaldoAgencia/:agencia', async (req, res) => {
  try {
    const result = await studentModel.find(
      { agencia: req.params.agencia },
      { _id: 0, balance: 1 }
    );

    let soma = 0;
    let media = 0;

    for (let i = 0; i < result.length; i++) {
      soma += result[i].balance;
    }

    media = soma / result.length;

    res.send(String(media));
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 10 - consultar os clientes com o menor saldo em conta com limite de resultados
app.get('/consultMenor/:limit', async (req, res) => {
  try {
    const student = await studentModel
      .find({})
      .sort({ balance: 1 })
      .limit(Number(req.params.limit));
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 11 - consultar os clientes com o maior saldo em conta com limite de resultados
app.get('/consultMaior/:limit', async (req, res) => {
  try {
    const student = await studentModel
      .find({})
      .sort({ balance: -1 })
      .limit(Number(req.params.limit));

    const sla = student.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
    });
    res.send(sla);
  } catch (error) {
    res.status(500).send(error);
  }
});

// atividade 12 - private agencia
app.get('/privateAgencia', async (req, res) => {
  try {
    // encontrar todas agencias
    const student = await studentModel.find({});

    let array = [];

    for (let i = 0; i < student.length; i++) {
      array[i] = student[i].agencia;
    }

    const newArray = array
      .filter((este, i) => array.indexOf(este) === i)
      .forEach(async (agencia) => {
        const agenciaSaldoMaior = await studentModel
          .find({ agencia: agencia })
          .sort({ balance: -1 })
          .limit(1);
        console.log(agenciaSaldoMaior);
      });

    res.send(agenciaSaldoMaior);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ver todos
app.get('/accounts', async (req, res) => {
  try {
    const student = await studentModel.find({});
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT GIT
app.put('/put/:id', async (req, res) => {
  try {
    const student = await studentModel.findOneAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// app.post('/student', async (req, res) => {
//   try {
//     const student = new studentModel(req.body);
//     await student.save();

//     res.send(student);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

export default app;
