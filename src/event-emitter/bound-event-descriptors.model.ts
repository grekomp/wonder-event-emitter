import {
  EventDescriptor,
  EventDictionary,
} from "src/event-emitter/event-descriptors.model";

export interface BoundEventDescriptor<DataType extends object>
  extends EventDescriptor<DataType> {
  on(listener: (data: DataType) => void): void;
  off(listener: (data: DataType) => void): void;
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
