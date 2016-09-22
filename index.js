'use strict'

var influx = require('influx');
var MqttListener = require('./MqttListener');
var StorageHandler = require('./handlers/StorageHandler');

var topics = [ 'truck/+/position', 'truck/+/speed' ];
var mqttConfig = {
  host: 'localhost',
  port: 1883,
  username: '',
  password: ''
};

var influxClient = influx({
  host: '192.168.56.104',
  protocol: 'http',
  database: 'mydb'
});

var listener = new MqttListener(mqttConfig, topics);
listener.register('storage_handler', new StorageHandler(influxClient));
listener.start();
