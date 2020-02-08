import Websocket from 'ws';
import express from 'express';
import path from 'path';
import chalk from 'chalk';
import faker from 'faker';

const app = express();

const PUBLIC_PATH = path.join(__dirname, '../', './static');
const PORT = 3000;
const WS_PORT = 3001;

app.use(express.static(PUBLIC_PATH));

app.get('/index.js', (_req, res) => {
  res.sendFile(path.join(__dirname, './client.js'));
});

const ws = new Websocket.Server({
  port: WS_PORT,
});

export interface Message {
  message: string;
  user: string;
  timestamp: Date;
}

interface Client {
  socket: any;
  messages: Message[];
}

interface ClientDB {
  [key: string]: Client;
}

const clientDB: ClientDB = {};

ws.on('connection', (clientSocket) => {
  const clientName: string = faker.name.firstName();

  clientDB[clientName] = {
    socket: clientSocket,
    messages: [],
  };

  console.log(chalk.cyan(`${clientName} connected!`));

  clientSocket.on('message', (message: string) => {
    const jsonMessage = {
      ...JSON.parse(message),
      user: clientName,
      timestamp: Date.now(),
    };

    console.log(chalk.yellow(`${clientName} sent: ${JSON.stringify(jsonMessage)}`));

    clientDB[clientName].messages.push(jsonMessage);

    Object.values(clientDB).forEach(({ socket }: Client) => {
      socket.send(JSON.stringify(jsonMessage));
    });
  });
});

app.listen(PORT, () => {
  console.log(chalk.green(`App successfully started on PORT ${PORT}`));
});
