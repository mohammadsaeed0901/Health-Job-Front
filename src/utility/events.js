import EventEmitter from "events";

class CustomEvent {
  eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(0);
  }

  on(eventName: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(eventName, listener);
  }

  removeEventListener(eventName: string, listener: (...args: any[]) => void) {
    this.eventEmitter.removeListener(eventName, listener);
  }

  emit(event: string, ...payload: any[]) {
    this.eventEmitter.emit(event, payload);
  }

  getEventEmitter() {
    return this.eventEmitter;
  }
}

const MyCustomEvent = new CustomEvent();
export default MyCustomEvent;
