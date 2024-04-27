# @grekomp/wonder-event-emitter

## 0.1.1

### Patch Changes

- 7490947: Fixed typo in publish workflow
- 7a81007: Updated publish github workflow to build the code before publishing

## 0.1.0

### Minor Changes

- a49cb60: Added "bound event definitions" - event definitions that have methods like `on`, `off`, `emit`, that call the respective methods on the bound event emitter.
  This makes adding event listeners and emitting events more convenient, as you only need to store the bound event dictionary, and don't need a reference to the event emitter.
