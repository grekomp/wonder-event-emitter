import {
  EventDescriptor,
  EventDictionary,
} from "src/event-emitter/event-descriptors.model";
import { EventHandler } from "src/event-emitter/event-emitter.model";

export interface BoundEventDescriptor<DataType extends object>
  extends EventDescriptor<DataType> {
  on(callback: EventHandler<DataType>): void;
  off(callback: EventHandler<DataType>): void;
  emit(data: DataType): void;
}

export type BoundEventDictionary = {
  [K: string]: BoundEventDescriptor<object> | BoundEventDictionary;
};

export type BoundEventDictionaryFor<Dictionary extends EventDictionary> = {
  [K in keyof Dictionary]: Dictionary[K] extends EventDescriptor<infer DataType>
    ? BoundEventDescriptor<DataType>
    : Dictionary[K] extends EventDictionary
      ? BoundEventDictionaryFor<Dictionary[K]>
      : Dictionary[K];
};
