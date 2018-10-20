var Service, Characteristic;
var net = require('net');

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-ledoverkill', 'LedOverkill', LedOverkillAccessory);
};

function LedOverkillAccessory(log, config) {
  this.log = log;
  this.hostname = config.hostname;
  this.name = config.name;

  this.tcpRequest = function(func, value = -1, callback) {
    var client = new net.Socket();
    var payload = func + ":" + value+ "\r";

    console.log('Connecting... payload: ' + payload);

    client.connect(8080, 'krissi-esp8266.local', function() {
      console.log('Connected');
      client.write(payload);
    });
    
    client.on('data', function(data) {
      var dataString = "";
      try {
        dataString = data.toString();
        callback(null, dataString);
      } catch (error) {
        callback(error);
      }
      client.destroy(); // kill client after server's response
    });

    client.on('end', function() {
      callback();
    })

    client.on('error', function() {
      callback(error);
    })

    client.on('close', function() {
      console.log('Connection closed');
    });
  }
}

LedOverkillAccessory.prototype = {
  identify: function(callback) {
    this.log('Identify requested!');
    callback();
  },

  getServices: function() {
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, 'LedOverill')
      .setCharacteristic(Characteristic.Model, 'WS2801 Strip')
      .setCharacteristic(Characteristic.FirmwareRevision, '0.1.0')
      .setCharacteristic(Characteristic.SerialNumber, 'LO001');

    this.service = new Service.Lightbulb(this.name);
    this.service
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this))
      .on('set', this.setPowerState.bind(this));

    this.service.addCharacteristic(new Characteristic.Brightness())
      .on('get', this.getBrightness.bind(this))
      .on('set', this.setBrightness.bind(this));

    this.service.addCharacteristic(new Characteristic.Hue())
      .on('get', this.getHue.bind(this))
      .on('set', this.setHue.bind(this));

    this.service.addCharacteristic(new Characteristic.Saturation())
      .on('get', this.getSaturation.bind(this))
      .on('set', this.setSaturation.bind(this));

    this.informationService = informationService;

    return [this.informationService, this.service];
  },

  getPowerState: function(callback) {
    this.tcpRequest("getPowerState", callback);
  },

  setPowerState: function(state, callback) {
    this.tcpRequest("setPowerState", state, callback);
  },

  getBrightness: function(callback) {
    this.tcpRequest("getBrightness", callback);
  },

  setBrightness: function(level, callback) {
    this.tcpRequest("setBrightness", level, callback);
  },

  getHue: function(callback) {
    this.tcpRequest("getHue", callback);
  },

  setHue: function(hue, callback) {
    this.tcpRequest("setHue:", hue, callback);
  },

  getSaturation: function(callback) {
    this.tcpRequest("getSaturation", callback);
  },

  setSaturation: function(saturation, callback) {
    this.tcpRequest("setSaturation", saturation, callback);
  },
};