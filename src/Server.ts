import { Socket } from 'net';
import { createServer, IncomingMessage, Server } from 'http';
import * as url from 'url';
import { Channel, ChannelRequest } from './Channel';

export class SokitServer {
  public httpServer: Server;
  public channels: Channel[] = [];

  constructor() {
    this.httpServer = createServer();
  }

  async start(port = 8080) {
    return new Promise((resolve) => {
      this.httpServer.listen(port, () => {
        resolve();
      });
    });
  }

  init() {
    this.httpServer.on(
      'upgrade',
      (req: ChannelRequest<unknown>, socket: Socket, head) => {
        const { pathname } = url.parse(req.url);

        for (const channel of this.channels) {
          const params = channel.pathParser.test(pathname);

          if (!params) continue;

          channel.upgradeRequest(req, socket, head);
        }
      },
    );
  }

  addChannels(channels: Channel[]) {
    this.channels.push(...channels);
  }

  addChannel(channel: Channel) {
    this.channels.push(channel);
  }
}
