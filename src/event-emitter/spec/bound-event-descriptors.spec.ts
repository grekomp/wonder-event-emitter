/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect, it, mock } from "bun:test";
import {
  bindEvent,
  bindEventDictionary,
} from "src/event-emitter/bound-event-descriptors";
import { BoundEventDictionaryFor } from "src/event-emitter/bound-event-descriptors.model";
import {
  defineEvent,
  defineEventDictionary,
} from "src/event-emitter/event-descriptors";
import {
  eventDescriptorSymbol,
  objectTypeSymbol,
} from "src/event-emitter/event-descriptors.model";
import { EventEmitter } from "src/event-emitter/event-emitter";

describe("BoundEventDescriptors", () => {
  describe("bindEvent", () => {
    it("should allow adding listeners to the event emitter", () => {
      const eventDescriptor = defineEvent<{ taskId: string; text: string }>()(
        "taskAddedEvent",
        "taskAddedEvent"
      );

      const emitter = new EventEmitter();

      const boundEventDescriptor = bindEvent(eventDescriptor, emitter);

      const boundEventListener = mock();

      boundEventDescriptor.on(boundEventListener);

      const eventData1 = { taskId: "1", text: "Hello" };

      boundEventDescriptor.emit(eventData1);
      expect(boundEventListener).toHaveBeenCalledTimes(1);
      expect(boundEventListener).toHaveBeenCalledWith(eventData1);

      const eventData2 = { taskId: "2", text: "World" };

      boundEventDescriptor.off(boundEventListener);
      boundEventDescriptor.emit(eventData2);
      expect(boundEventListener).toHaveBeenCalledTimes(1);
      expect(boundEventListener).not.toHaveBeenCalledWith(eventData2);
    });

    it("should act like a normal event descriptor when used with event emitter", () => {
      const eventDescriptor = defineEvent<{ taskId: string; text: string }>()(
        "taskAddedEvent",
        "taskAddedEvent"
      );

      const emitter = new EventEmitter();

      const boundEventDescriptor = bindEvent(eventDescriptor, emitter);

      const eventData = { taskId: "1", text: "Hello" };
      const eventListener = mock();

      emitter.on(boundEventDescriptor, eventListener);
      emitter.emit(boundEventDescriptor, eventData);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(eventData);

      const eventData2 = { taskId: "2", text: "World" };
      emitter.off(boundEventDescriptor, eventListener);
      emitter.emit(boundEventDescriptor, eventData2);
      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).not.toHaveBeenCalledWith(eventData2);
    });

    it("should allow removing listeners added directly to the emitter", () => {
      const eventDescriptor = defineEvent<{ taskId: string; text: string }>()(
        "taskAddedEvent",
        "taskAddedEvent"
      );

      const emitter = new EventEmitter();

      const boundEventDescriptor = bindEvent(eventDescriptor, emitter);

      const emitterEventListener = mock();
      emitter.on(eventDescriptor, emitterEventListener);

      const eventData1 = { taskId: "1", text: "Hello" };

      emitter.emit(eventDescriptor, eventData1);
      expect(emitterEventListener).toHaveBeenCalledTimes(1);
      expect(emitterEventListener).toHaveBeenCalledWith(eventData1);

      boundEventDescriptor.off(emitterEventListener);

      const eventData2 = { taskId: "2", text: "World" };

      emitter.emit(eventDescriptor, eventData2);
      expect(emitterEventListener).toHaveBeenCalledTimes(1);
      expect(emitterEventListener).not.toHaveBeenLastCalledWith(eventData2);
    });
  });

  describe("bindEventDictionary", () => {
    it("should create an object with bound event definitions", () => {
      const eventDictionary = defineEventDictionary({
        testEvent1: defineEvent(),
        testEvent2: defineEvent(),
      });

      const boundEventDictionary = bindEventDictionary(
        eventDictionary,
        new EventEmitter()
      );

      expect(boundEventDictionary).toEqual({
        testEvent1: {
          [objectTypeSymbol]: eventDescriptorSymbol,
          id: expect.any(String),
          innerPath: "testEvent1",
          path: "testEvent1",
          on: expect.any(Function),
          off: expect.any(Function),
          emit: expect.any(Function),
        },
        testEvent2: {
          [objectTypeSymbol]: eventDescriptorSymbol,
          id: expect.any(String),
          innerPath: "testEvent2",
          path: "testEvent2",
          on: expect.any(Function),
          off: expect.any(Function),
          emit: expect.any(Function),
        },
      } as BoundEventDictionaryFor<typeof eventDictionary>);
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

      const boundEventDictionary = bindEventDictionary(
        eventDictionary,
        new EventEmitter()
      );

      expect(boundEventDictionary).toEqual({
        rootEvent: {
          [objectTypeSymbol]: eventDescriptorSymbol,
          id: expect.any(String),
          innerPath: "rootEvent",
          path: "rootEvent",
          on: expect.any(Function),
          off: expect.any(Function),
          emit: expect.any(Function),
        },
        nestedEvents: {
          nestedEvent1: {
            [objectTypeSymbol]: eventDescriptorSymbol,
            id: expect.any(String),
            innerPath: "nestedEvents.nestedEvent1",
            path: "nestedEvents.nestedEvent1",
            on: expect.any(Function),
            off: expect.any(Function),
            emit: expect.any(Function),
          },
          nestedEvent2: {
            [objectTypeSymbol]: eventDescriptorSymbol,
            id: expect.any(String),
            innerPath: "nestedEvents.nestedEvent2",
            path: "nestedEvents.nestedEvent2",
            on: expect.any(Function),
            off: expect.any(Function),
            emit: expect.any(Function),
          },
          deeplyNestedEvents: {
            deeplyNestedEvent1: {
              [objectTypeSymbol]: eventDescriptorSymbol,
              id: expect.any(String),
              innerPath: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent1",
              path: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent1",
              on: expect.any(Function),
              off: expect.any(Function),
              emit: expect.any(Function),
            },
            deeplyNestedEvent2: {
              [objectTypeSymbol]: eventDescriptorSymbol,
              id: expect.any(String),
              innerPath: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent2",
              path: "nestedEvents.deeplyNestedEvents.deeplyNestedEvent2",
              on: expect.any(Function),
              off: expect.any(Function),
              emit: expect.any(Function),
            },
          },
        },
      } as BoundEventDictionaryFor<typeof eventDictionary>);
    });

    it("should allow adding and calling listeners", () => {
      const eventDictionary = defineEventDictionary({
        testEvent1: defineEvent<{ taskId: string; text: string }>(),
        testEvent2: defineEvent<{ taskId: string; text: string }>(),
      });

      const emitter = new EventEmitter();

      const boundEventDictionary = bindEventDictionary(
        eventDictionary,
        emitter
      );

      const boundEventListener = mock();

      boundEventDictionary.testEvent1.on(boundEventListener);

      const eventData1 = { taskId: "1", text: "Hello" };

      boundEventDictionary.testEvent1.emit(eventData1);
      expect(boundEventListener).toHaveBeenCalledTimes(1);
      expect(boundEventListener).toHaveBeenCalledWith(eventData1);

      const eventData2 = { taskId: "2", text: "World" };

      boundEventDictionary.testEvent1.off(boundEventListener);
      boundEventDictionary.testEvent1.emit(eventData2);
      expect(boundEventListener).toHaveBeenCalledTimes(1);
      expect(boundEventListener).not.toHaveBeenCalledWith(eventData2);
    });

    it("should allow adding and calling listeners for nested events", () => {
      const eventDictionary = defineEventDictionary({
        rootEvent: defineEvent<{ taskId: string; text: string }>(),
        nestedEvents: {
          nestedEvent1: defineEvent<{ taskId: string; text: string }>(),
          nestedEvent2: defineEvent<{ taskId: string; text: string }>(),
          deeplyNestedEvents: {
            deeplyNestedEvent1: defineEvent<{ taskId: string; text: string }>(),
            deeplyNestedEvent2: defineEvent<{ taskId: string; text: string }>(),
          },
        },
      });

      const emitter = new EventEmitter();

      const boundEventDictionary = bindEventDictionary(
        eventDictionary,
        emitter
      );

      const boundEventListener = mock();

      boundEventDictionary.nestedEvents.nestedEvent1.on(boundEventListener);

      const eventData1 = { taskId: "1", text: "Hello" };

      boundEventDictionary.nestedEvents.nestedEvent1.emit(eventData1);
      expect(boundEventListener).toHaveBeenCalledTimes(1);
      expect(boundEventListener).toHaveBeenCalledWith(eventData1);

      const eventData2 = { taskId: "2", text: "World" };

      boundEventDictionary.nestedEvents.nestedEvent1.off(boundEventListener);
      boundEventDictionary.nestedEvents.nestedEvent1.emit(eventData2);
      expect(boundEventListener).toHaveBeenCalledTimes(1);
      expect(boundEventListener).not.toHaveBeenCalledWith(eventData2);
    });

    it("should allow removing listeners added directly to the emitter", () => {
      const eventDictionary = defineEventDictionary({
        testEvent1: defineEvent<{ taskId: string; text: string }>(),
        testEvent2: defineEvent<{ taskId: string; text: string }>(),
      });

      const emitter = new EventEmitter();

      const boundEventDictionary = bindEventDictionary(
        eventDictionary,
        emitter
      );

      const emitterEventListener = mock();
      emitter.on(eventDictionary.testEvent1, emitterEventListener);

      const eventData1 = { taskId: "1", text: "Hello" };

      emitter.emit(eventDictionary.testEvent1, eventData1);
      expect(emitterEventListener).toHaveBeenCalledTimes(1);
      expect(emitterEventListener).toHaveBeenCalledWith(eventData1);

      boundEventDictionary.testEvent1.off(emitterEventListener);

      const eventData2 = { taskId: "2", text: "World" };

      emitter.emit(eventDictionary.testEvent1, eventData2);
      expect(emitterEventListener).toHaveBeenCalledTimes(1);
      expect(emitterEventListener).not.toHaveBeenCalledWith(eventData2);
    });
  });
});
