---
"@grekomp/wonder-event-emitter": minor
---

Added "bound event definitions" - event definitions that have methods like `on`, `off`, `emit`, that call the respective methods on the bound event emitter.
This makes adding event listeners and emitting events more convenient, as you only need to store the bound event dictionary, and don't need a reference to the event emitter.
