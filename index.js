'use strict'

var MqttListener = require('./MqttListener');
var StorageHandler = require('./handlers/StorageHandler');

var topics = [ '#' ];
var mqttConfig = {
  host: 'localhost',
  port: 1883,
  username: '',
  password: ''
};

var listener = new MqttListener(mqttConfig, topics);
listener.register('storage_handler', new StorageHandler());
listener.start();
