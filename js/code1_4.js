var quakes = Rx.Observable
    .timer(0, 5000)
    .flatMap(function() {        
        return Rx.DOM.jsonpRequest({
            url: QUAKE_URL,
            jsonpCallback: 'eqfeed_callback'
        }).retry(3);        
    })
    .flatMap(function transform(result) {
        return Rx.Observable.from(result.response.features);
    })    
    .map(function(quake){
        return {
            code: quake.properties.code,
            lat: quake.geometry.coordinates[1],
            lng: quake.geometry.coordinates[0],
            size: quake.properties.mag * 10000
        };
    })
    .distinct(function(quake) { 
        return quake.code;
    })

var count = Rx.Observable
    .timer(0, 10000)
    .flatMap(function(){
        return quakes.count();
    });

// var marks = Rx.Observable
//     .timer(0, 3000)
//     .flatMap(function(){
//         return quakes.distinct(function(quake) { 
//             return quake.code;
//         });
//     });

count.subscribe(function(x){
    console.log(x);
});

quakes.subscribe(function(quake) {
    L.circle([quake.lat, quake.lng], quake.size).addTo(map);
});