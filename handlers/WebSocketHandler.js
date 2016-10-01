'use strict';

var http = require('http');
var sockjs = require('sockjs');


const SOCKJS_URL = 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js';

class WebSocketHandler {
  constructor() {
    var socketListener = sockjs.createServer({ sockjs_url: SOCKJS_URL });
    var httpServer = http.createServer();
    this.subscribedDevices = {};

    socketListener.on('connection', (connection) => {
      connection.on('data', (message) => {
        var data = JSON.parse(message);
        if (data.type === 'subscribe') {
          // TODO: check permissions, otherwise send negative
          connection.deviceId = data.deviceId;

          if (!this.subscribedDevices.hasOwnProperty(data.deviceId)) {
            this.subscribedDevices[data.deviceId] = [];
          }
          this.subscribedDevices[data.deviceId].push(connection);

          connection.write(JSON.stringify({
            status: 'ok'
          }));
        }
      });
      connection.on('close', () => {
        if (connection.deviceId) {
          var connections = this.subscribedDevices[connection.deviceId];
          var index = -1;
          for (var i = 0; i < connections.length; ++i) {
            if (connections[i].id === connection.id) {
              index = i;
              break;
            }
          }
          if (index > -1) {
            connections.splice(index, 1);
            if (connections.length === 0) {
              console.log(`No more connections for ${connection.deviceId}`);
              delete this.subscribedDevices[connection.deviceId];
            }
          }
        }
      });
    });

    socketListener.installHandlers(httpServer, { prefix: '/ws' });
    httpServer.listen(8080, '0.0.0.0');
  }

  notify(topic, message, info) {
    var deviceId = info.deviceId;
    if (!this.subscribedDevices.hasOwnProperty(deviceId)) {
      return;
    }

    var data = {
      topic: topic,
      message: message,
      info: info
    };
    this.subscribedDevices[deviceId].forEach((connection) => {
      connection.write(JSON.stringify(data))
    });
  }
}

module.exports = WebSocketHandler;
