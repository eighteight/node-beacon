var osc = require('node-osc');
var oscClients = [];
oscClients.push(new osc.Client('172.20.12.147', 3000));
oscClients.push(new osc.Client('172.20.12.135', 3000));
var client = new osc.Client('172.20.12.147', 3000);
var isIce = false;
var isMint = false;
var isBluberry = false;
var isBoth = false;

var deviceStates = [];

var oscServer = new osc.Server(3000, '0.0.0.0');
oscServer.on("message", function (msg, rinfo) {

    console.log('got '+ JSON.stringify(msg));
    let beacon = msg[1];
    let deviceId = msg[2];

    let prevDevState = deviceStates.find(x => x.deviceId === deviceId);
    if (!prevDevState) {
        deviceStates.push({deviceId: deviceId, beacon: beacon });
    } else {
        //device found, check the state
        if (prevDevState.beacon !== beacon) {
            //state changed, update it
            let lngth = deviceStates.length;
            deviceStates = deviceStates.filter( x => {
                    return x.deviceId != prevDevState.deviceId;
        });
            if (lngth > deviceStates.length)
                deviceStates.push({deviceId: deviceId, beacon: beacon });
        }
    }

    if (!isBoth && deviceStates.length > 1 && deviceStates[0].beacon === deviceStates[1].beacon){
        isBoth = true;
        oscClients.forEach(client => {
            client.send('/torch/1', 'near', function () {});
            client.send('/color/1', 255, 0, 0, function(){});
            client.send('/audio/1', 5, function(){});
            client.send('/vibrate/1', 'vibrate', function(){});
        });
        return;
    }

    isBoth = false;


    if (deviceId != '7E05DD00-5098-4929-AA8C-4642C6211404') return;
    if (beacon === 'ice' && !isIce){
        isIce = true;
        isMint = false;
        isBluberry = false;
        console.log('ice');
        oscClients.forEach(client => {
            client.send('/rain3d/1', 'near', function () {});
            client.send('/audio/1', 1, function(){});
        });
    } else if (beacon === 'mint' && !isMint){
        isMint = true;
        isIce = false;
        isBluberry = false;
        oscClients.forEach(client => {
            client.send('/heat/1', 'near', function () {
            });
        });
    } else if (beacon === 'blueberry' && !isBluberry){
        isBluberry = true;
        isIce = false;
        isMint = false;
        oscClients.forEach(client => {
            client.send('/crystalls3d/1', 'near', function () {
        });
        });
    } else {
        console.log("something else " +beacon);
    }
    console.log('Devices: ' + JSON.stringify(deviceStates));
});
