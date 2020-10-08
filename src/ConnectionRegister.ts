import * as WebSocket from 'ws';

export class ConnectionRegister {
  private connections: Map<string, Set<WebSocket>> = new Map();

  public registerConnection(id: string, connection: WebSocket) {
    if (!this.connections.has(id)) {
      this.connections.set(id, new Set());
    }

    this.connections.get(id).add(connection);
  }

  public removeConnection(id: string, connection: WebSocket) {
    this.connections.get(id)?.delete(connection);
  }

  public getConnections(id: string) {
    return this.connections.get(id);
  }

  public count(id: string) {
    return this.getConnections(id)?.size;
  }
}
