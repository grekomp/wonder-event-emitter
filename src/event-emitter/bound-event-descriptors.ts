import {
  BoundEventDescriptor,
  BoundEventDictionaryFor,
} from "src/event-emitter/bound-event-descriptors.model";
import {
  EventDescriptor,
  EventDictionary,
} from "src/event-emitter/event-descriptors.model";
import { isEventDescriptor } from "src/event-emitter/event-descriptors.utils";
import { EventEmitter } from "src/event-emitter/event-emitter";

export function bindEvent<DataType extends object>(
  eventDescriptor: EventDescriptor<DataType>,
  emitter: EventEmitter
): BoundEventDescriptor<DataType> {
  return {
    ...eventDescriptor,
    on: (listener) => emitter.on(eventDescriptor, listener),
    off: (listener) => emitter.off(eventDescriptor, listener),
    emit: (data) => emitter.emit(eventDescriptor, data),
  };
}

export function bindEventDictionary<Dictionary extends EventDictionary>(
  eventDictionary: Dictionary,
  emitter: EventEmitter
): BoundEventDictionaryFor<Dictionary> {
  return Object.fromEntries(
    Object.entries(eventDictionary).map(([key, value]) => {
      if (isEventDescriptor(value)) return [key, bindEvent(value, emitter)];
      if (typeof value === "object")
        return [key, bindEventDictionary(value, emitter)];
      return [key, value];
    })
  ) as BoundEventDictionaryFor<Dictionary>;
}
