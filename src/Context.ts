import * as WebSocket from 'ws';
import { Channel, ChannelRequest } from './Channel';

export class Context<Params = any> {
  public connection: WebSocket;
  public req: ChannelRequest<any>;
  public channel: Channel;
  public params: Params;

  constructor(ws: WebSocket, req: ChannelRequest<any>, channel: Channel) {
    this.connection = ws;
    this.req = req;
    this.params = req.params;
    this.channel = channel;
  }

  public emit(data: any) {
    this.channel.broadcast(this.req.pathname, data, this.connection);
  }

  public broadcast(data: any) {
    this.channel.broadcast(this.req.pathname, data);
  }
}
