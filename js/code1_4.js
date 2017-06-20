var quakes = Rx.DOM.jsonpRequest({
        url: QUAKE_URL,
        jsonpCallback: 'eqfeed_callback'
    }).retry(3)
    .flatMap(function transform(result) {
        return Rx.Observable.from(result.response.features);
    });

var quakesData = Rx.Observable
    .timer(1, 2000)
    .flatMap(function(){        
        return quakes;
    })
    .map(function(quake){
        return {
            code: quake.properties.code,
            lat: quake.geometry.coordinates[1],
            lng: quake.geometry.coordinates[0],
            size: quake.properties.mag * 10000
        }
    })
    .distinct(function(quake){
        return quake.code;
    });

var quakesCount = Rx.Observable
    .timer(0, 5000)
    .flatMap(function(){
        return quakes.count()
    });

quakesCount.subscribe(function(count){
    console.log('Earthquakes: ' + count);
});

quakesData.subscribe(function(quake) {
    L.circle([quake.lat, quake.lng], quake.size).addTo(map);
});