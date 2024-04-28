import {
  bindEvent,
  bindEventDictionary,
} from "src/event-emitter/bound-event-descriptors";
import {
  defineEvent,
  defineEventDictionary,
} from "src/event-emitter/event-descriptors";
import { EventEmitter } from "src/event-emitter/event-emitter";

export * from "src/event-emitter/bound-event-descriptors.model";
export * from "src/event-emitter/event-descriptors.model";
export * from "src/event-emitter/event-emitter.model";
export {
  EventEmitter as WonderEventEmitter,
  bindEvent,
  bindEventDictionary,
  defineEvent,
  defineEventDictionary,
};
