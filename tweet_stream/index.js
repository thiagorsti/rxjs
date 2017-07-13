var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: 8080 });
var Twit = require('twit');
var Rx = require('rx');

var T = new Twit({
    consumer_key: 'rFhfB5hFlth0BHC7iqQkEtTyw',
    consumer_secret: 'zcrXEM1jiOdKyiFFlGYFAOo43Hsz383i0cdHYYWqBXTBoVAr1x',
    access_token: '14343133-nlxZbtLuTEwgAlaLsmfrr3D4QAoiV2fa6xXUVEwW9',
    access_token_secret: '57Dr99wECljyyQ9tViJWz0H3obNG3V4cr5Lix9sQBXju1'
});

// Rx.Observable.fromEvent(wss, 'connection')
//     .subscribe(function(ws){
//         ws.send('Mensagem do servidor');
//         Rx.Observable.fromEvent(ws, 'message')
//             .subscribe(function(message){
//                 console.log(message);
//             });
//     });

function onConnect(ws) {

    var stream;
    function startTwitStream(locations) {
        stream = T.stream('statuses/filter',
        {
            track: 'earthquake',
            locations: locations
        });
    }
    startTwitStream('');

    Rx.Observable
        .fromEvent(ws, 'message')        
        .flatMap(function(quakesObj){
            quakesObj = JSON.parse(quakesObj);            
            return Rx.Observable.from(quakesObj.quakes);
        })
        .scan(function(boundsArray, quake){
            var bounds = [
                quake.lng - 0.3, quake.lat - 0.15,
                quake.lng + 0.3, quake.lat + 0.15
            ].map(function(coordinate){
                coordinate = coordinate.toString();
                return coordinate.match(/\-?\d+(\.\-?\d{2})?/)[0];
            });            
            var arr = boundsArray.concat(bounds);
            arr.slice(Math.max(arr.length - 50), 0);
            return arr;
        }, [])        
        .subscribe(function(boundsArray){            
            stream.stop();
            startTwitStream(boundsArray.toString());
        });

        Rx.Observable.fromEvent(stream, 'tweet')
            .subscribe(function(tweetObject){
                ws.send(JSON.stringify(tweetObject), function(err){
                    if (err) {
                        console.log('There was an error sending the message');
                    }
                });
            });
}

Rx.Observable.fromEvent(wss, 'connection').subscribe(onConnect);