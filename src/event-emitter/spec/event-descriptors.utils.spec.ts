import { describe, expect, it } from "bun:test";
import {
  defineEvent,
  defineEventDictionary,
} from "src/event-emitter/event-descriptors";
import { isEventDescriptor } from "src/event-emitter/event-descriptors.utils";

describe("Event Descriptor Utils", () => {
  describe("isEventDescriptor", () => {
    it("should return true for valid event descriptors", () => {
      expect(
        isEventDescriptor(defineEvent()("testEventPath", "testEventOuterPath")),
      ).toBeTrue();
      expect(
        isEventDescriptor(
          defineEvent()("otherEventPath", "otherEventOuterPath"),
        ),
      ).toBeTrue();

      const eventDictionary = defineEventDictionary({
        testEventInDictionary: defineEvent(),
      });
      expect(
        isEventDescriptor(eventDictionary.testEventInDictionary),
      ).toBeTrue();
    });

    it("should return false for other values", () => {
      expect(isEventDescriptor(null)).toBeFalse();
      expect(isEventDescriptor(undefined)).toBeFalse();
      expect(isEventDescriptor("testEventPath")).toBeFalse();
      expect(isEventDescriptor({})).toBeFalse();
      expect(isEventDescriptor({ id: "testEventPath" })).toBeFalse();
      expect(isEventDescriptor({ innerPath: "testEventPath" })).toBeFalse();
      expect(
        isEventDescriptor({
          id: "testEventPath",
          innerPath: "testEventPath",
          path: "testFullPath",
        }),
      ).toBeFalse();

      const eventDictionary = defineEventDictionary({
        unusedTestEvent: defineEvent(),
      });
      expect(isEventDescriptor(eventDictionary)).toBeFalse();
    });
  });
});
