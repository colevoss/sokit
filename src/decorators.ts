import { Channel, MessageHandler } from './Channel';

export function test() {
  return function (
    // target: Object,
    target: Channel,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    console.log('Testerator');
  };
}

export function Message(messageName?: string) {
  return function <C extends Channel>(
    target: C,
    propertyKey: keyof C,
    descriptor: PropertyDescriptor,
  ) {
    const propertyMetadata = Reflect.getMetadata(propertyKey, target) || {};

    Reflect.defineMetadata(
      propertyKey,
      {
        ...propertyMetadata,
        message: messageName || propertyKey,
      },
      target,
    );

    return descriptor;
  };
}
