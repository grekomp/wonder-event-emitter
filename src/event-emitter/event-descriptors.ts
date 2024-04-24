import {
  type CombinedEventDictionaryFor,
  type EventDescriptorFactoryDictionary,
  type ModuleEventDescriptor,
  type ModuleEventDictionary,
  type ModuleEventDictionaryFor,
} from "src/event-emitter/event-descriptors.model";

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
  return (innerPath: string) => {
    const eventUuid = crypto.randomUUID();
    return {
      id: `${innerPath}__${eventUuid}`,
      innerPath,
    } as ModuleEventDescriptor<DataType>;
  };
}

export function defineEventDictionary<
  Dict extends EventDescriptorFactoryDictionary,
>(
  factoryDictionary: Dict,
  prefix: string = "",
): ModuleEventDictionaryFor<Dict> {
  return Object.fromEntries(
    Object.entries(factoryDictionary).map(([key, value]) => {
      if (typeof value === "function") return [key, value(`${prefix}${key}`)];
      return [key, defineEventDictionary(value, `${prefix}${key}.`)];
    }),
  ) as ModuleEventDictionaryFor<Dict>;
}

export function defineCombinedEventDictionary<
  Dict extends ModuleEventDictionary,
>(
  eventDictionary: Dict,
  prefix: string = "",
): CombinedEventDictionaryFor<Dict> {
  return Object.fromEntries(
    Object.entries(eventDictionary).map(([key, value]) => {
      if ("id" in value) return [key, { ...value, path: `${prefix}${key}` }];
      return [key, defineCombinedEventDictionary(value, `${prefix}${key}.`)];
    }),
  ) as CombinedEventDictionaryFor<Dict>;
}
