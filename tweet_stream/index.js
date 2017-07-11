var WebSocketServer = require('ws').Server;
var Twit = require('twit');
var Rx = require('rx');

// var T = new Twit({
//     consumer_key: 'rFhfB5hFlth0BHC7iqQkEtTyw',
//     consumer_secret: 'zcrXEM1jiOdKyiFFlGYFAOo43Hsz383i0cdHYYWqBXTBoVAr1x',
//     access_token: '14343133-nlxZbtLuTEwgAlaLsmfrr3D4QAoiV2fa6xXUVEwW9',
//     access_token_secret: '57Dr99wECljyyQ9tViJWz0H3obNG3V4cr5Lix9sQBXju1'
// });

function onConnect(ws) {
    console.log('Client connected on localhost:8080');
    ws.send('teste');
}

var ws = new WebSocketServer({ port: 8080 });
Rx.Observable.fromEvent(ws, 'connection').subscribe(onConnect);

ws.on('message', function(event){
    console.log(event);
});

// var onMessage = Rx.Observable.fromEvent(ws, 'message')
//     .subscribe(function(quake) {
//         quake = JSON.parse(quake);
//         console.log(quake);
//     });