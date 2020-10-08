import {
  Channel,
  ChannelRequest,
  MessageData,
  MessageMethods,
} from './Channel';
import { Context } from './Context';
import { Message } from './decorators';

interface RoomParams {
  roomId: string;
}

export class TestChannel extends Channel {
  public path = '/rooms/:roomId';

  public async beforeConnect(req: ChannelRequest<RoomParams>) {
    console.log('YAY!!!!!!!!', req.params);
  }

  public async onConnect(context: Context<RoomParams>) {
    console.log('Connecting!', context.params);

    context.broadcast({
      type: 'connected',
      stats: Date.now(),
      hello: 'CONNECT',
    });
  }

  public async onClose(context: Context<RoomParams>) {
    console.log('Closing!');
    context.broadcast({
      type: 'close',
      stats: Date.now(),
      hello: 'BYE',
    });
  }

  @Message()
  async chat(
    context: Context<RoomParams>,
    message: MessageData<{ hello: string }>,
  ) {
    console.log(message.data.hello);

    context.emit({
      type: 'chat',
      hello: context.params.roomId,
      stats: Date.now(),
    });
  }
}

type Te = MessageMethods<TestChannel>;
