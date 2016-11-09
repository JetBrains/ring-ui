import ttls from '../delayed/delayed';

/* global angular:false */
const angularModule = angular.module('Ring.delayed-propery-set', []);

class DelayedPropertySet {
  timeoutPromise = null;

  constructor(timeout, object, property, offValue = false, onValue = true, ttl = ttls.buttonLoader) {
    this.timeout = timeout;
    this.object = object;
    this.property = property;
    this.offValue = offValue;
    this.onValue = onValue;
    this.ttl = ttl;

    this.object[this.property] = this.offValue;
  }

  run() {
    if (this.timeoutPromise) {
      return undefined;
    }

    this.timeoutPromise = this.timeout(() => {
      this.object[this.property] = this.onValue;
      this.timeoutPromise = null;
    }, this.ttl);

    return this.timeoutPromise;
  }

  cancel() {
    this.timeout.cancel(this.timeoutPromise);
    this.timeoutPromise = null;

    this.object[this.property] = this.offValue;
  }
}

angularModule.factory('rgDelayedPropertySet',
  $timeout => (...args) => new DelayedPropertySet($timeout, ...args)
);

export default angularModule.name;
