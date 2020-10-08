import { Socket } from 'net';
import { IncomingMessage } from 'http';
import * as url from 'url';
import * as WebSocket from 'ws';
import { Path } from 'path-parser';
import { Message } from './decorators';
import { ConnectionRegister } from './ConnectionRegister';
import { Context } from './Context';

export interface ChannelRequest<Params> extends IncomingMessage {
  params: Params;
  pathname: string;
}

export type MessageData<D extends { [key: string]: any }> = {
  type: string;
  data: D;
};

export type MessageHandler = <Params, D = any>(
  context: Context<Params>,
  message: MessageData<D>,
) => Promise<void>;

export type MessageMethods<T> = Exclude<
  {
    [K in keyof T]: T[K] extends MessageHandler ? K : never;
  }[keyof T],
  'onClose' | 'onConnect'
>;

export class Channel {
  public messages: { [key: string]: MessageHandler } = {};
  public wss: WebSocket.Server;
  public connectionRegister: ConnectionRegister = new ConnectionRegister();
  private handlers: {
    [K in MessageMethods<this>]: { handler: MessageHandler };
  };

  public path: string = '/rooms/:roomId';
  public pathParser: Path;

  constructor() {
    this.wss = new WebSocket.Server({ noServer: true, clientTracking: false });
    this.pathParser = new Path(this.path);

    this.registerChannel();
    this.setupWssHandlers();
  }

  public async beforeConnect(req: ChannelRequest<any>) {}
  public async onConnect(context: Context) {}
  public async onClose(context: Context) {}

  private getMessageHandlers() {
    const prototype = Object.getPrototypeOf(this);
    const properties = Object.getOwnPropertyNames(prototype);

    let handlers: any = {};

    for (const property of properties) {
      const propMetadata: { message: string } = Reflect.getOwnMetadata(
        property,
        prototype,
      );

      if (!propMetadata || !propMetadata.hasOwnProperty('message')) {
        continue;
      }

      const handler = ((this[
        property as keyof this
      ] as unknown) as MessageHandler).bind(this);

      handlers[propMetadata.message] = {
        ...(handlers[propMetadata.message] || {}),
        handler,
      };
    }

    console.log('Registered handlers', handlers);

    return handlers;
  }

  private setupWssHandlers() {
    this.wss.on('connection', this.onConnection.bind(this));
  }

  private contextFactory<Params>(
    ws: WebSocket,
    req: ChannelRequest<Params>,
  ): Context<Params> {
    return new Context(ws, req, this);
  }

  private onConnection<Params>(ws: WebSocket, req: ChannelRequest<Params>) {
    const { pathname } = req;

    this.connectionRegister.registerConnection(pathname, ws);
    console.log('Connection created', this.connectionRegister.count(pathname));

    const context = this.contextFactory(ws, req);

    ws.on('message', (data: any) => {
      const parsedMessage = JSON.parse(data);
      const type = parsedMessage.type as MessageMethods<this>;

      const handler = this.handlers[type];
      console.log(data, type, this.handlers, handler);

      if (!handler || !handler.handler) return;

      handler.handler(context, parsedMessage);
    });

    ws.on('close', () => {
      this.connectionRegister.removeConnection(pathname, ws);
      this.onClose(context);
    });

    this.onConnect(context);
  }

  public broadcast(id: string, data: any, ignoreConnection?: WebSocket) {
    const connections = this.connectionRegister.getConnections(id);

    if (!connections) return;

    const message = JSON.stringify(data);

    connections.forEach((conn) => {
      if (ignoreConnection !== conn && conn.readyState === WebSocket.OPEN) {
        conn.send(message);
      }
    });
  }

  public async upgradeRequest(
    req: ChannelRequest<any>,
    socket: Socket,
    head: Buffer,
  ) {
    const parsedUrl = url.parse(req.url);
    const requestPath = parsedUrl.pathname;
    const params = this.pathParser.test(requestPath);

    if (!params) return;

    req.params = params;
    req.pathname = parsedUrl.pathname;

    try {
      await this.beforeConnect(req);
    } catch (e) {
      console.error(e);

      return;
    }

    this.wss.handleUpgrade(req, socket, head, (ws) => {
      this.wss.emit('connection', ws, req);
    });
  }

  public registerChannel() {
    this.handlers = this.getMessageHandlers();
  }
}
