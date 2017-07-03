function makeRow(props) {
    var row = document.createElement('tr');
    row.id = props.net + props.code;

    var date = new Date(props.time);
    var time = date.toString();
    [props.place, props.mag, time].forEach(function(text){
        var cell = document.createElement('td');
        cell.textContent = text;
        row.appendChild(cell);
    });
    return row;
}

function initialize() {
    var quakes = Rx.Observable
        .interval(5000)
        .flatMap(function(){            
            return Rx.DOM.jsonpRequest({
                url: QUAKE_URL,
                jsonpCallback: 'eqfeed_callback'
            });
        })
    .flatMap(function(result){
        return Rx.Observable.from(result.response.features);
    })
    .distinct(function(quake) { return quake.properties.code; })
    .share();

    quakes.subscribe(function(quake) {
        var coords = quake.geometry.coordinates;
        var size = quake.properties.mag * 10000;
        L.circle([coords[1], coords[0]], size).addTo(map);
    });

    var cont = 0;
    var table = document.getElementById('quakes_info');
    quakes
        .pluck('properties')        
        .map(makeRow)
        .bufferWithTime(500)
        .filter(function(rows) { console.log(++cont); return rows.length > 0; })
        .map(function(rows){
            var fragment = document.createDocumentFragment();
            rows.forEach(function(row){
                fragment.appendChild(row);
            });
            return fragment;
        })
        .subscribe(function(row){
            table.appendChild(row);
        });
}

Rx.DOM.ready().subscribe(initialize);