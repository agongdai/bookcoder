import { FunctionType } from '@/types/common';

class Socket {
  private socket: WebSocket | null;
  private _isConnected: boolean = false;

  constructor() {
    this.socket = null;
  }

  get isConnected() {
    return this._isConnected;
  }

  connect(url: string) {
    if (!this.socket) {
      console.log('connecting to socket ... in Socket');
      try {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
          this._isConnected = true;
        };
        this.socket.onclose = () => {
          this._isConnected = false;
        };
      } catch (error) {
        console.error('Error connecting to socket', error);
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    } else {
      return true;
    }
  }

  send(message: Record<string, unknown>) {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
  }

  on(eventName: string, callback: FunctionType) {
    if (this.socket) {
      this.socket.addEventListener(eventName, callback);
    }
  }
}

export { Socket };
