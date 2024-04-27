export const eventDataTypeKey = Symbol("dataType");
export const objectTypeSymbol = Symbol("objectType");
export const eventDictionarySymbol = Symbol("eventDictionary");
export const eventDescriptorSymbol = Symbol("eventDescriptor");

export type DataTypeOf<T> =
  T extends EventDescriptor<infer DataType> ? DataType : never;

export interface EventDescriptor<DataType extends object> {
  id: string;
  [objectTypeSymbol]: typeof eventDescriptorSymbol;
  [eventDataTypeKey]: DataType;
  innerPath?: string;
  path?: string;
}

export type EventDictionary = {
  [key: string]: EventDescriptor<object> | EventDictionary;
};

export type EventDescriptorFactory<DataType extends object> = (
  innerPath: string,
  outerPath: string
) => EventDescriptor<DataType>;
export type EventDescriptorFactoryDictionary = {
  [key: string]:
    | EventDescriptorFactory<object>
    | EventDescriptorFactoryDictionary;
};

export type EventOrFactoryDictionary = {
  [key: string]:
    | EventDescriptor<object>
    | EventDescriptorFactory<object>
    | EventOrFactoryDictionary;
};

export type EventDictionaryFor<FactoryDict extends EventOrFactoryDictionary> = {
  [Key in keyof FactoryDict]: FactoryDict[Key] extends EventDescriptorFactory<
    infer DataType
  >
    ? EventDescriptor<DataType>
    : FactoryDict[Key] extends EventDescriptor<infer DataType>
      ? EventDescriptor<DataType>
      : FactoryDict[Key] extends EventOrFactoryDictionary
        ? EventDictionaryFor<FactoryDict[Key]>
        : never;
};

export type NestedEventDescriptors<Dict extends EventDictionary> = {
  [Key in keyof Dict]: Dict[Key] extends EventDictionary
    ? NestedEventDescriptors<Dict[Key]>
    : Dict[Key];
}[keyof Dict];
