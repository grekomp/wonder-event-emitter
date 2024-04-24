import {
  defineEvent,
  defineEventDictionary,
} from "src/event-emitter/event-descriptors";
import {
  ModuleEventDescriptor,
  ModuleEventDictionary,
} from "src/event-emitter/event-descriptors.model";
import { describe, expectTypeOf, it } from "vitest";

describe("Event descriptors", () => {
  describe("defineEvent", () => {
    it("dataType should default to object", () => {
      const eventDescriptionFactory = defineEvent();
      expectTypeOf(eventDescriptionFactory).toBeFunction();

      const eventDescription = eventDescriptionFactory("testEventPath");
      expectTypeOf(eventDescription).toEqualTypeOf<
        ModuleEventDescriptor<object>
      >();
    });

    it("dataType should be set to the generic argument passed to defineEvent", () => {
      const eventDescriptionFactory = defineEvent<{
        testString: string;
        testNumber: number;
      }>();
      expectTypeOf(eventDescriptionFactory).toBeFunction();

      const eventDescription = eventDescriptionFactory("testEventPath");
      expectTypeOf(eventDescription).toEqualTypeOf<
        ModuleEventDescriptor<{ testString: string; testNumber: number }>
      >();
    });

    it("multiple event descriptions created with the same factory should have the same dataType", () => {
      const eventDescriptionFactory = defineEvent<{
        testString: string;
        testNumber: number;
      }>();
      const eventDescription1 = eventDescriptionFactory("testEventPath1");
      const eventDescription2 = eventDescriptionFactory("testEventPath2");

      expectTypeOf(eventDescription1).toEqualTypeOf<
        ModuleEventDescriptor<{ testString: string; testNumber: number }>
      >();
      expectTypeOf(eventDescription2).toEqualTypeOf<
        ModuleEventDescriptor<{ testString: string; testNumber: number }>
      >();
      expectTypeOf(eventDescription1).toEqualTypeOf(eventDescription2);
    });

    it("event factories created with different generic arguments should have different data types", () => {
      const eventDescriptionFactory1 = defineEvent<{
        testString1: string;
        testNumber1: number;
      }>();
      const eventDescriptionFactory2 = defineEvent<{
        testString2: string;
        testNumber2: number;
      }>();
      const eventDescription1 = eventDescriptionFactory1("testEventPath1");
      const eventDescription2 = eventDescriptionFactory2("testEventPath2");

      expectTypeOf(eventDescription1).toEqualTypeOf<
        ModuleEventDescriptor<{ testString1: string; testNumber1: number }>
      >();
      expectTypeOf(eventDescription2).toEqualTypeOf<
        ModuleEventDescriptor<{ testString2: string; testNumber2: number }>
      >();
      expectTypeOf(eventDescription1).not.toEqualTypeOf(eventDescription2);
    });
  });

  describe("defineEventDictionary", () => {
    it("should create an object with event definitions", () => {
      const eventDictionary = defineEventDictionary({
        rootEvent: defineEvent<{ rootEventKey: string }>(),
        nestedEvents: {
          nestedEvent1: defineEvent<{ nestedEvent1Key: string }>(),
          nestedEvent2: defineEvent<{ nestedEvent2Key: string }>(),
          deeplyNestedEvents: {
            deeplyNestedEvent1: defineEvent<{
              deeplyNestedEvent1Key: string;
            }>(),
            deeplyNestedEvent2: defineEvent<{
              deeplyNestedEvent2Key: string;
            }>(),
          },
        },
      });

      expectTypeOf(eventDictionary).toBeObject();
      expectTypeOf(eventDictionary).toMatchTypeOf<ModuleEventDictionary>();
      expectTypeOf(eventDictionary.rootEvent).toEqualTypeOf<
        ModuleEventDescriptor<{ rootEventKey: string }>
      >();
      expectTypeOf(
        eventDictionary.nestedEvents,
      ).toMatchTypeOf<ModuleEventDictionary>();
      expectTypeOf(eventDictionary.nestedEvents.nestedEvent1).toEqualTypeOf<
        ModuleEventDescriptor<{ nestedEvent1Key: string }>
      >();
      expectTypeOf(eventDictionary.nestedEvents.nestedEvent2).toEqualTypeOf<
        ModuleEventDescriptor<{ nestedEvent2Key: string }>
      >();
      expectTypeOf(
        eventDictionary.nestedEvents.deeplyNestedEvents.deeplyNestedEvent1,
      ).toEqualTypeOf<
        ModuleEventDescriptor<{ deeplyNestedEvent1Key: string }>
      >();
      expectTypeOf(
        eventDictionary.nestedEvents.deeplyNestedEvents.deeplyNestedEvent2,
      ).toEqualTypeOf<
        ModuleEventDescriptor<{ deeplyNestedEvent2Key: string }>
      >();
    });
  });
});
