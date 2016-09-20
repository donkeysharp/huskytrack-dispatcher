'use strict';

var mqtt = require('mqtt');
var Observable = require('./Observable');


class MqttListener  extends Observable {
  constructor(config, topics) {
    super();

    this.config = config;
    this.topics = topics;
    this.connected = false;
  }

  start() {
    if (this.connected) {
      return;
    }
    var mqttUrl = `mqtt://${this.config.host}:${this.config.port}`;
    this.client = mqtt.connect(mqttUrl, {
      username: this.config.username,
      password: this.config.password
    });

    var self = this;
    this.client.on('connect', function() {
      console.log('INFO: Connected to mqtt broker.');
      self.connected = true;

      console.log(`INFO: Subscribing to: ${JSON.stringify(self.topics)}`);
      self.client.subscribe(self.topics);
    });

    this.client.on('message', function(topic, message) {
      console.log(`Message from ${topic}, notifying...`);
      self.notifyObservers(topic, message);
    });

    this.client.on('offline', function() {
      console.log('INFO: Connection with mqtt broker has been lost.');
      self.client.unsubscribe(self.topics);
      self.connected = false;
    });
  }
}


module.exports = MqttListener;
