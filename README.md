# Wonder Event Emitter

A strongly typed event emitter with top of the line DX

## Quickstart

Install with your preferred package manager

```shell
npm install @grekomp/wonder-event-emitter
```

Instantiate the event emitter

```ts
import { WonderEventEmitter } from "@grekomp/wonder-event-emitter";

const eventEmitter = new WonderEventEmitter();
```

Define your event dictionary

```ts
const todoAppEvents = defineEventDictionary({
  tasks: {
    added: defineEvent<{ taskId: string; text: string }>(),
    removed: defineEvent<{ taskId: string }>(),
  },
  user: {
    loggedIn: defineEvent<{ userId: string }>(),
    loggedOut: defineEvent<{ userId: string }>(),
  },
});
```

Use the event dictionary to add/remove event listeners, and emit events, all with full typescript support.

```ts
eventEmitter.on(todoAppEvents.tasks.added, (data) =>
  console.log("Task added", data.taskId, data.text),
);

eventEmitter.emit(todoAppEvents.tasks.added, {
  taskId: "1",
  text: "Eat cookies",
});
```

## Usage

```ts
import {
  WonderEventEmitter,
  defineEvent,
  defineEventDictionary,
} from "@grekomp/wonder-event-emitter";

// Create an instance of the event emitter anywhere
const eventEmitter = new WonderEventEmitter();

// Define your events
const todoAppEvents = defineEventDictionary({
  tasks: {
    added: defineEvent<{ taskId: string; text: string }>(),
    removed: defineEvent<{ taskId: string }>(),
  },
  user: {
    loggedIn: defineEvent<{ userId: string }>(),
    loggedOut: defineEvent<{ userId: string }>(),
  },
});

// Use the event dictionary to add/remove listeners
eventEmitter.on(todoAppEvents.tasks.added, (data) =>
  // `data` is inferred as `{ taskId: string, text: string }` based on your event definition!
  console.log("Task added", data.taskId, data.text),
);

// Emit events using the same event dictionary!
eventEmitter.emit(todoAppEvents.tasks.added, {
  taskId: "1",
  text: "Eat cookies",
});

// You can define multiple event dictionaries for different modules
const calendarModuleEvents = defineEventDictionary({
  events: {
    added: defineEvent<{ eventId: string; title: string }>(),
    removed: defineEvent<{ eventId: string }>(),
  },
});

// ...and use them separately
eventEmitter.on(calendarModuleEvents.events.added, (data) =>
  console.log("Event added", data.eventId, data.title),
);

// Or combine them into a single dictionary
const combinedEvents = defineEventDictionary({
  todoApp: todoAppEvents,
  calendarModule: calendarModuleEvents,
});

// Use the combined dictionary or the individual module dictionaries interchangeably
eventEmitter.on(combinedEvents.todoApp.tasks.added, (data) =>
  console.log("Task added", data.taskId, data.text),
);
eventEmitter.emit(todoAppEvents.tasks.added, {
  taskId: "2",
  text: "Play games",
});
```
