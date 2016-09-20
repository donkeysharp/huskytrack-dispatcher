'use strict';


class StorageHandler {
  constructor() {
  }

  notify(topic, message) {
    console.log(`Storage Handler: ${topic} ${message}`);
  }
}

module.exports = StorageHandler;
