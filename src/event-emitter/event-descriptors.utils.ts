import {
  EventDescriptor,
  eventDescriptorSymbol,
  objectTypeSymbol,
} from "src/event-emitter/event-descriptors.model";

export function isEventDescriptor(
  value: unknown,
): value is EventDescriptor<object> {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "innerPath" in value &&
    objectTypeSymbol in value &&
    value[objectTypeSymbol] === eventDescriptorSymbol
  );
}
