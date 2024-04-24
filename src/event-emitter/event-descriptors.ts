import {
  EventDescriptor,
  EventDictionaryFor,
  EventOrFactoryDictionary,
  eventDescriptorSymbol,
  objectTypeSymbol,
} from "src/event-emitter/event-descriptors.model";
import { isEventDescriptor } from "src/event-emitter/event-descriptors.utils";

/**
 * Defines a unique event, along with the type of data it should be emitted with.
 *
 * Usually used in conjunction with {@link defineEventDictionary} to define multiple
 * events at once, but can also be used standalone.
 *
 * @example
 * ```ts
 * // Usage with `defineEventDictionary`
 * const eventDictionary = defineEventDictionary({
 *   tasks: {
 *     added: defineEvent<{ taskId: string, text: string }>(),
 *     removed: defineEvent<{ taskId: string }>(),
 *   },
 * });
 *
 * eventEmitter.on(eventDictionary.tasks.added, (data) => console.log(data.taskId, data.text));
 *
 * // Standalone usage
 * const taskAddedEvent = defineEvent<{ taskId: string, text: string }>()("taskAddedEvent");
 *
 * eventEmitter.on(taskAddedEvent, (data) => console.log(data.taskId, data.text));
 * // ---------------------------- 👆 data has its type inferred as `{ taskId: string, text: string }`
 * ```
 *
 * @returns A function accepting a single string argument, which will be used as the prefix for the event id.
 */
export function defineEvent<DataType extends object>() {
  return (innerPath: string, outerPath: string) => {
    const eventUuid = crypto.randomUUID();
    return {
      [objectTypeSymbol]: eventDescriptorSymbol,

      id: `${innerPath}__${eventUuid}`,
      path: outerPath,
      innerPath,
    } as EventDescriptor<DataType>;
  };
}

export function defineEventDictionary<Dict extends EventOrFactoryDictionary>(
  factoryDictionary: Dict,
  innerPathPrefix: string = "",
  pathPrefix: string = "",
): EventDictionaryFor<Dict> {
  return Object.fromEntries(
    Object.entries(factoryDictionary).map(([key, value]) => {
      if (isEventDescriptor(value))
        return [key, { ...value, path: `${pathPrefix}${key}` }];

      if (typeof value === "function")
        return [
          key,
          value(`${innerPathPrefix}${key}`, `${innerPathPrefix}${key}`),
        ];

      if (typeof value === "object")
        return [
          key,
          defineEventDictionary(
            value,
            `${innerPathPrefix}${key}.`,
            `${pathPrefix}${key}.`,
          ),
        ];
      return [key, value];
    }),
  ) as EventDictionaryFor<Dict>;
}
