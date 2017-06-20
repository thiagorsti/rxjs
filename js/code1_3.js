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
    .distinct(function(quake) { 
        return quake.properties.code;
    })
    .map(function(quake){
        return {
            lat: quake.geometry.coordinates[1],
            lng: quake.geometry.coordinates[0],
            size: quake.properties.mag * 10000
        };
    });

var count = Rx.Observable
    .timer(0, 2000)
    .flatMap(function(){
        return quakes
            .scan(function(acc, x){
                return acc + 1;
            }, 0)
    });    
    

quakes.subscribe(function(quake){    
    L.circle([quake.lat, quake.lng], quake.size).addTo(map);
});

count.subscribe(function(x){
    console.log('X: ' + x);
});