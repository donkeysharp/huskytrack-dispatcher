'use strict';

var mqtt = require('mqtt');
var Observable = require('./Observable');

var truckRegex = /truck\/(.+)\/(speed|position|fuel)/;


class MqttListener  extends Observable {
  constructor(config, topics) {
    super();

    this.config = config;
    this.topics = topics;
    this.connected = false;
  }

  __initializeMqtt() {
    var mqttUrl = `mqtt://${this.config.host}:${this.config.port}`;
    this.client = mqtt.connect(mqttUrl, {
      username: this.config.username,
      password: this.config.password
    });

    var self = this;
    // Init connection events
    this.client.on('connect', function() {
      console.log('INFO: Connected to mqtt broker.');
      self.connected = true;

      console.log(`INFO: Subscribing to: ${JSON.stringify(self.topics)}`);
      self.client.subscribe(self.topics);
    });

    // unsubscribe if client goes offline
    this.client.on('offline', function() {
      console.log('INFO: Connection with mqtt broker has been lost.');

      self.client.unsubscribe(self.topics);
      self.connected = false;
    });

    this.__mqttListen()
  }

  __mqttListen() {
    var self = this;

    this.client.on('message', function(topic, message) {
      if (!truckRegex.test(topic)) { return; }

      var topicResult = truckRegex.exec(topic);
      var info = {
        deviceId: topicResult[1],
        dataType: topicResult[2],
      };

      console.log(`Message from ${topic}, notifying...`);
      self.notifyObservers(topic, message, info);
    });
  }

  start() {
    if (this.connected) {
      return;
    }
    this.__initializeMqtt();
  }
}


module.exports = MqttListener;
