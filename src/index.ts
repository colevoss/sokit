import { createServer, IncomingMessage, ServerResponse } from 'http';

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200);
  console.log('Request!');
  res.end('Hello, World!');
};

const server = createServer(requestListener);

server.listen(8080, () => {
  console.log('listening on port 8080!');
});
