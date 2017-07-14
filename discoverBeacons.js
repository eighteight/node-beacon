var Bleacon = require('bleacon');
var osc = require('node-osc');
var uuid = 'e2c56db5dffb48d2b060d0f5a71096e0';
var major = 0; // 0 - 65535
var minor = 0; // 0 - 65535
var measuredPower = -59; // -128 - 127 (measured RSSI at 1 meter)

//Bleacon.startAdvertising(uuid, major, minor, measuredPower);
Bleacon.startScanning(/*'6819470458200cc7e56a4dbb56bffe2d'*/);

var client = new osc.Client('172.20.12.16', 3000);
var isnear = false;
var isImmediate = false;

Bleacon.on('discover', function(bleacon) {

    console.log('found '+ JSON.stringify(bleacon));
    let prox = bleacon.proximity;//JSON.stringify(bleacon.proximity);
    if (prox == 'immediate' && !isImmediate){
        isImmediate = true;
        isnear = false;
      console.log('immm');
        client.send('/dziga/1', 'near', function () {
            //client.kill();
        });
    } else if (prox == 'near' && !isnear){
        isnear = true;
        isImmediate = false;
        client.send('/rain3d/1', 'near', function () {
            //client.kill();
        });
    } else {
      console.log("something else " +prox);
    }
});
