import 'reflect-metadata';
import { SokitServer } from './Server';
import { TestChannel } from './TestChannel';

const chan = new TestChannel();

const server = new SokitServer();

server.addChannel(chan);

server.init();

async function main() {
  await server.start();

  console.log('Server started');
}

main();
// x[0].handler({ test: 'hello' }, { message: 'hello' });
