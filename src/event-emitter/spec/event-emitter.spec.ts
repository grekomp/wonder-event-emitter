import { describe, expect, it, mock } from "bun:test";
import {
  defineCombinedEventDictionary,
  defineEvent,
  defineEventDictionary,
} from "src/event-emitter/event-descriptors";
import { EventEmitter } from "src/event-emitter/event-emitter";

describe("EventEmitter", () => {
  it("should allow event handlers to be added and removed", () => {
    const eventEmitter = new EventEmitter();

    const handlerToBeCalledOnce = mock();
    const handlerToBeCalledTwice = mock();
    const testEventDescription = defineEvent<{ testEventData: string }>()(
      "testEvent",
    );

    eventEmitter.on(testEventDescription, handlerToBeCalledOnce);
    eventEmitter.on(testEventDescription, handlerToBeCalledTwice);
    eventEmitter.emit(testEventDescription, {
      testEventData: "test event data value",
    });

    expect(handlerToBeCalledOnce).toHaveBeenCalledTimes(1);
    expect(handlerToBeCalledOnce).toHaveBeenCalledWith({
      testEventData: "test event data value",
    });

    expect(handlerToBeCalledTwice).toHaveBeenCalledTimes(1);
    expect(handlerToBeCalledTwice).toHaveBeenCalledWith({
      testEventData: "test event data value",
    });

    eventEmitter.off(testEventDescription, handlerToBeCalledOnce);
    eventEmitter.emit(testEventDescription, {
      testEventData: "second test event data value",
    });

    expect(handlerToBeCalledOnce).toHaveBeenCalledTimes(1);
    expect(handlerToBeCalledTwice).toHaveBeenCalledTimes(2);
    expect(handlerToBeCalledTwice).toHaveBeenLastCalledWith({
      testEventData: "second test event data value",
    });
  });

  it("should allow using event dictionaries to add and remove event handlers", () => {
    const eventEmitter = new EventEmitter();

    const handler = mock();
    const handlerToNotBeCalled = mock();
    const eventDictionary = defineEventDictionary({
      testEvent: defineEvent<{ testEventData: string }>(),
      unusedTestEvent: defineEvent<{ unusedEventData: string }>(),
    });

    eventEmitter.on(eventDictionary.testEvent, handler);
    eventEmitter.on(eventDictionary.unusedTestEvent, handlerToNotBeCalled);
    eventEmitter.emit(eventDictionary.testEvent, {
      testEventData: "test event data value",
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      testEventData: "test event data value",
    });
    expect(handlerToNotBeCalled).not.toHaveBeenCalled();

    eventEmitter.off(eventDictionary.testEvent, handler);
    eventEmitter.emit(eventDictionary.testEvent, {
      testEventData: "second test event data value",
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should allow using combined event dictionaries and normal event dictionaries interchangeably", () => {
    const eventEmitter = new EventEmitter();

    const handlerToBeAddedWithCombinedEventDictionary = mock();
    const handlerToBeAddedWithModuleEventDictionary = mock();

    const moduleEventDictionary = defineEventDictionary({
      moduleEvent: defineEvent<{ moduleEventData: string }>(),
    });
    const combinedEventDictionary = defineCombinedEventDictionary({
      moduleEvents: moduleEventDictionary,
    });

    eventEmitter.on(
      moduleEventDictionary.moduleEvent,
      handlerToBeAddedWithModuleEventDictionary,
    );
    eventEmitter.on(
      combinedEventDictionary.moduleEvents.moduleEvent,
      handlerToBeAddedWithCombinedEventDictionary,
    );

    eventEmitter.emit(moduleEventDictionary.moduleEvent, {
      moduleEventData: "test module event data value",
    });

    expect(handlerToBeAddedWithModuleEventDictionary).toHaveBeenCalledTimes(1);
    expect(handlerToBeAddedWithModuleEventDictionary).toHaveBeenLastCalledWith({
      moduleEventData: "test module event data value",
    });

    expect(handlerToBeAddedWithCombinedEventDictionary).toHaveBeenCalledTimes(
      1,
    );
    expect(
      handlerToBeAddedWithCombinedEventDictionary,
    ).toHaveBeenLastCalledWith({
      moduleEventData: "test module event data value",
    });

    eventEmitter.emit(combinedEventDictionary.moduleEvents.moduleEvent, {
      moduleEventData: "second test module event data value",
    });

    expect(handlerToBeAddedWithModuleEventDictionary).toHaveBeenCalledTimes(2);
    expect(handlerToBeAddedWithModuleEventDictionary).toHaveBeenLastCalledWith({
      moduleEventData: "second test module event data value",
    });

    expect(handlerToBeAddedWithCombinedEventDictionary).toHaveBeenCalledTimes(
      2,
    );
    expect(
      handlerToBeAddedWithCombinedEventDictionary,
    ).toHaveBeenLastCalledWith({
      moduleEventData: "second test module event data value",
    });
  });
});
