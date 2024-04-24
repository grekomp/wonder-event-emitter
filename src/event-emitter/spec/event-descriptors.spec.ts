/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  defineCombinedEventDictionary,
  defineEvent,
  defineEventDictionary,
} from "src/event-emitter/event-descriptors";
import { describe, expect, it } from "vitest";

describe("Event descriptors", () => {
  describe("defineEvent", () => {
    it("should return a function that creates an event definition", () => {
      const eventDescriptionFactory = defineEvent();
      expect(typeof eventDescriptionFactory).toBe("function");

      const eventDescription = eventDescriptionFactory("testEventPath");

      expect(typeof eventDescription).toBe("object");
      expect(eventDescription).toHaveProperty("innerPath", "testEventPath");
    });

    it("should return a function that allows you to create multiple event definitions", () => {
      const eventDescriptionFactory = defineEvent();
      const eventDescription1 = eventDescriptionFactory("testEventPath1");
      const eventDescription2 = eventDescriptionFactory("testEventPath2");

      expect(eventDescription1).toHaveProperty("innerPath", "testEventPath1");
      expect(eventDescription2).toHaveProperty("innerPath", "testEventPath2");

      expect(eventDescription1).not.toBe(eventDescription2);
    });

    it("should return a function that creates unique event definitions", () => {
      const eventDescriptionFactory = defineEvent();
      const eventDescription1 = eventDescriptionFactory("testEventPath");
      const eventDescription2 = eventDescriptionFactory("testEventPath");

      expect(eventDescription1).toHaveProperty("innerPath", "testEventPath");
      expect(eventDescription2).toHaveProperty("innerPath", "testEventPath");

      expect(eventDescription1).not.toEqual(eventDescription2);
    });
  });

  describe("defineEventDictionary", () => {
    it("should create an object with event definitions", () => {
      const eventDictionary = defineEventDictionary({
        testEvent1: defineEvent(),
        testEvent2: defineEvent(),
      });

      expect(eventDictionary).toEqual({
        testEvent1: {
          id: expect.any(String),
          innerPath: "testEvent1",
        },
        testEvent2: {
          id: expect.any(String),
          innerPath: "testEvent2",
        },
      });
    });

    it("should support nested objects in the event dictionary", () => {
      const eventDictionary = defineEventDictionary({
        rootEvent: defineEvent(),
        nestedEvents: {
          nestedEvent1: defineEvent(),
          nestedEvent2: defineEvent(),
          deeplyNestedEvents: {
            deeplyNestedEvent1: defineEvent(),
            deeplyNestedEvent2: defineEvent(),
          },
        },
      });

      expect(eventDictionary).toEqual({
        rootEvent: {
          id: expect.any(String),
          innerPath: "rootEvent",
        },
        nestedEvents: {
          nestedEvent1: {
            id: expect.any(String),
            innerPath: "nestedEvents.nestedEvent1",
          },
          nestedEvent2: {
            id: expect.any(String),
            innerPath: "nestedEvents.nestedEvent2",
          },
          deeplyNestedEvents: {
            deeplyNestedEvent1: {
              id: expect.any(String),
              innerPath: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent1",
            },
            deeplyNestedEvent2: {
              id: expect.any(String),
              innerPath: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent2",
            },
          },
        },
      });
    });
  });

  describe("defineCombinedEventDictionary", () => {
    it("should create an object combining multiple event dictionaries", () => {
      const eventDictionary1 = defineEventDictionary({
        testEvent1: defineEvent(),
        testEvent2: defineEvent(),
      });
      const eventDictionary2 = defineEventDictionary({
        testEvent3: defineEvent(),
        testEvent4: defineEvent(),
      });

      const combinedEventDictionary = defineCombinedEventDictionary({
        eventDictionary1,
        eventDictionary2,
      });

      expect(combinedEventDictionary).toEqual({
        eventDictionary1: {
          testEvent1: {
            id: expect.any(String),
            innerPath: "testEvent1",
            path: "eventDictionary1.testEvent1",
          },
          testEvent2: {
            id: expect.any(String),
            innerPath: "testEvent2",
            path: "eventDictionary1.testEvent2",
          },
        },
        eventDictionary2: {
          testEvent3: {
            id: expect.any(String),
            innerPath: "testEvent3",
            path: "eventDictionary2.testEvent3",
          },
          testEvent4: {
            id: expect.any(String),
            innerPath: "testEvent4",
            path: "eventDictionary2.testEvent4",
          },
        },
      });
    });

    it("should support nested objects in the event dictionary", () => {
      const eventDictionary1 = defineEventDictionary({
        rootEvent: defineEvent(),
        nestedEvents: {
          nestedEvent1: defineEvent(),
          nestedEvent2: defineEvent(),
          deeplyNestedEvents: {
            deeplyNestedEvent1: defineEvent(),
            deeplyNestedEvent2: defineEvent(),
          },
        },
      });

      const eventDictionary2 = defineEventDictionary({
        otherRootEvent: defineEvent(),
        nestedEvents: {
          nestedEvent3: defineEvent(),
          nestedEvent4: defineEvent(),
          deeplyNestedEvents: {
            deeplyNestedEvent1: defineEvent(),
            deeplyNestedEvent2: defineEvent(),
          },
        },
      });

      const eventDictionary3 = defineEventDictionary({
        testEvent1: defineEvent(),
        testEvent2: defineEvent(),
      });

      const combinedEventDictionary = defineCombinedEventDictionary({
        eventDictionary1,
        nestedDictionary: {
          eventDictionary2,
          eventDictionary3,
        },
      });

      expect(combinedEventDictionary).toEqual({
        eventDictionary1: {
          rootEvent: {
            id: expect.any(String),
            innerPath: "rootEvent",
            path: "eventDictionary1.rootEvent",
          },
          nestedEvents: {
            nestedEvent1: {
              id: expect.any(String),
              innerPath: "nestedEvents.nestedEvent1",
              path: "eventDictionary1.nestedEvents.nestedEvent1",
            },
            nestedEvent2: {
              id: expect.any(String),
              innerPath: "nestedEvents.nestedEvent2",
              path: "eventDictionary1.nestedEvents.nestedEvent2",
            },
            deeplyNestedEvents: {
              deeplyNestedEvent1: {
                id: expect.any(String),
                innerPath: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent1",
                path: "eventDictionary1.nestedEvents.deeplyNestedEvents.deeplyNestedEvent1",
              },
              deeplyNestedEvent2: {
                id: expect.any(String),
                innerPath: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent2",
                path: "eventDictionary1.nestedEvents.deeplyNestedEvents.deeplyNestedEvent2",
              },
            },
          },
        },
        nestedDictionary: {
          eventDictionary2: {
            otherRootEvent: {
              id: expect.any(String),
              innerPath: "otherRootEvent",
              path: "nestedDictionary.eventDictionary2.otherRootEvent",
            },
            nestedEvents: {
              nestedEvent3: {
                id: expect.any(String),
                innerPath: "nestedEvents.nestedEvent3",
                path: "nestedDictionary.eventDictionary2.nestedEvents.nestedEvent3",
              },
              nestedEvent4: {
                id: expect.any(String),
                innerPath: "nestedEvents.nestedEvent4",
                path: "nestedDictionary.eventDictionary2.nestedEvents.nestedEvent4",
              },
              deeplyNestedEvents: {
                deeplyNestedEvent1: {
                  id: expect.any(String),
                  innerPath:
                    "nestedEvents.deeplyNestedEvents.deeplyNestedEvent1",
                  path: "nestedDictionary.eventDictionary2.nestedEvents.deeplyNestedEvents.deeplyNestedEvent1",
                },
                deeplyNestedEvent2: {
                  id: expect.any(String),
                  innerPath:
                    "nestedEvents.deeplyNestedEvents.deeplyNestedEvent2",
                  path: "nestedDictionary.eventDictionary2.nestedEvents.deeplyNestedEvents.deeplyNestedEvent2",
                },
              },
            },
          },
          eventDictionary3: {
            testEvent1: {
              id: expect.any(String),
              innerPath: "testEvent1",
              path: "nestedDictionary.eventDictionary3.testEvent1",
            },
            testEvent2: {
              id: expect.any(String),
              innerPath: "testEvent2",
              path: "nestedDictionary.eventDictionary3.testEvent2",
            },
          },
        },
      });
    });
  });
});