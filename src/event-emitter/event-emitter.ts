import { type EventDescriptor } from "src/event-emitter/event-descriptors.model";
import type { EventHandler } from "src/event-emitter/event-emitter.model";

export class EventEmitter {
  private callbacks: Partial<Record<string, EventHandler<never>[]>> = {};

  on<DataType extends object>(
    event: EventDescriptor<DataType>,
    callback: EventHandler<DataType>,
  ) {
    const eventId = event.id;
    this.callbacks[eventId] ??= [];
    if (this.callbacks[eventId]?.includes(callback)) return;

    this.callbacks[eventId]?.push(callback);
  }
  off<DataType extends object>(
    event: EventDescriptor<DataType>,
    callback: EventHandler<DataType>,
  ) {
    const eventId = event.id;
    const callbacksForEvent = this.callbacks[eventId];
    if (!callbacksForEvent) return;

    const index = callbacksForEvent.indexOf(callback);
    if (index === -1) return;

    callbacksForEvent.splice(index, 1);
  }
  emit<DataType extends object>(
    event: EventDescriptor<DataType>,
    data: DataType,
  ) {
    const eventId = event.id;
    this.callbacks[eventId]?.forEach((callback) =>
      (callback as EventHandler<DataType>)(data),
    );
  }
}
