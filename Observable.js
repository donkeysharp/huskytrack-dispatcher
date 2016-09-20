'use strict';

class Observable {
  constructor() {
    this.observers = {};
  }

  register(name, observable) {
    if (!this.observers.hasOwnProperty(name)) {
      this.observers[name] = observable;
    }
  }

  unregister(observableName) {
    if (this.observers.hasOwnProperty(name)) {
      delete this.observers[name];
    }
  }

  notifyObservers(topic, message) {
    Object.keys(this.observers).forEach((key) => {
      var observer = this.observers[key];
      observer.notify(topic, message);
    });
  }
}

module.exports = Observable;
