var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-ledoverkill', 'LedOverkill', LedOverkillAccessory);
};

function LedOverkillAccessory(log, config) {
  this.log = log;
  this.hostname = config.hostname;
  this.name = config.name;
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
      .on('get', this.getState.bind(this))
      .on('set', this.setState.bind(this));

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

  getState: function(callback) {
    callback(null, true);
  },

  setState: function(on, callback) {
  },

  getBrightness: function(callback) {
    callback(null, 100);
  },

  setBrightness: function(level, callback) {
  },

  getHue: function(callback) {
    callback(null, 100);
  },

  setHue: function(hue, callback) {
  },

  getSaturation: function(callback) {
    callback(null, 100);
  },

  setSaturation: function(saturation, callback) {
  },
};
