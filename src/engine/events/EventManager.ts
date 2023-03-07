// TODO: this isn't engine code
// import { Events } from "../../town-builder/events/events";

export function createEventManager(): EventManager {
  return new EventManager();
}

export type Handler = (payload: any) => void;

interface FiredEvent {
  name: string;
  fired: number;
}

class EventManager {
  private listeners: Map<string, Handler[]> = new Map();
  private eventsFired: FiredEvent[] = [];

  public listen(event: string, handler: Handler): void {
    const handlers = this.listeners.get(event);
    const newHandlers = handlers ? [...handlers, handler] : [handler];
    this.listeners.set(event, newHandlers);
  }

  public remove(event: string, handler: Handler): void {
    const handlers = this.listeners.get(event);
    if (!handlers) {
      // TODO: (refactor) move to centralised logger
      console.warn(
        "Attempted to remove handler that was not attached",
        event,
        handler
      );
      return;
    }

    for (const h of handlers) {
      if (h === handler) {
        this.listeners.set(
          event,
          handlers.filter((hf) => hf !== h)
        );
        return;
      }
    }

    console.warn(
      "Attempted to remove handler that was not attached",
      event,
      handler
    );
  }

  // TODO: can we improve the event string & payload type here?
  public trigger<T>(event: string, payload: T): void {
    const listener = this.listeners.get(event);
    if (!listener || !listener.length) {
      return;
    }

    this.eventsFired.push({ name: event, fired: Date.now() });

    for (const l of listener) {
      l(payload as T);
    }
  }

  // public debug(filter: Events[]): void {
  //   let y = 0;
  //   for (const e of this.eventsFired) {
  //     if (filter.includes(e.name)) {
  //       continue;
  //     }
  //
  //     renderer.fillText(`${e.fired}: ${e.name}`, vec(0, y), Color.white());
  //     y += 16;
  //   }
  // }
}
