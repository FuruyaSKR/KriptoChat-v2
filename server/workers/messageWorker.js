const { parentPort } = require("worker_threads");

parentPort.on("message", (mensagem) => {
  const resposta = `[Processado pelo Worker]: ${mensagem}`;
  parentPort.postMessage(resposta);
});
