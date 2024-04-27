import {
  bindEvent,
  bindEventDictionary,
} from "src/event-emitter/bound-event-descriptors";
import { BoundEventDescriptor } from "src/event-emitter/bound-event-descriptors.model";
import {
  defineEvent,
  defineEventDictionary,
} from "src/event-emitter/event-descriptors";
import { EventEmitter } from "src/event-emitter/event-emitter";
import { describe, expectTypeOf, it } from "vitest";

describe("Bound event descriptors", () => {
  describe("bindEvent", () => {
    it("dataType should default to object", () => {
      const eventDescription = defineEvent()(
        "testEventInnerPath",
        "testEventOuterPath"
      );

      const emitter = new EventEmitter();
      const boundEventDescriptor = bindEvent(eventDescription, emitter);

      expectTypeOf(boundEventDescriptor).toEqualTypeOf<
        BoundEventDescriptor<object>
      >();
    });

    it("dataType should be set to the generic argument passed to defineEvent", () => {
      const eventDescription = defineEvent<{
        testString: string;
        testNumber: number;
      }>()("testEventInnerPath", "testEventOuterPath");

      const emitter = new EventEmitter();
      const boundEventDescriptor = bindEvent(eventDescription, emitter);
      expectTypeOf(boundEventDescriptor).toEqualTypeOf<
        BoundEventDescriptor<{
          testString: string;
          testNumber: number;
        }>
      >();
    });
  });

  describe("bindEventDictionary", () => {
    it("should create an object with bound event definitions", () => {
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

      const emitter = new EventEmitter();
      const boundEventDictionary = bindEventDictionary(
        eventDictionary,
        emitter
      );

      expectTypeOf(boundEventDictionary).toEqualTypeOf<{
        rootEvent: BoundEventDescriptor<{ rootEventKey: string }>;
        nestedEvents: {
          nestedEvent1: BoundEventDescriptor<{ nestedEvent1Key: string }>;
          nestedEvent2: BoundEventDescriptor<{ nestedEvent2Key: string }>;
          deeplyNestedEvents: {
            deeplyNestedEvent1: BoundEventDescriptor<{
              deeplyNestedEvent1Key: string;
            }>;
            deeplyNestedEvent2: BoundEventDescriptor<{
              deeplyNestedEvent2Key: string;
            }>;
          };
        };
      }>();
    });
  });
});
