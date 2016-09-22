'use strict';


class StorageHandler {
  constructor(influxClient) {
    this.influxClient = influxClient;
  }

  notify(topic, message, info) {
    var influx = this.influxClient;

    return new Promise((resolve, reject) => {
      try {
        var data = {
          value: parseFloat(message)
        };
        var tags = {
          deviceId: info.deviceId
        }
        influx.writePoint(info.dataType, data, tags, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({ message: 'data added sucessfully' });
          }
        });
      } catch(e) {
        reject({ message: 'there was a problemo jefe' });
      }
    });
  }
}

module.exports = StorageHandler;
