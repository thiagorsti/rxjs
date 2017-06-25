
var playerFiring = Rx.Observable
    .merge(
        Rx.Observable.fromEvent(canvas, 'click'),
        Rx.Observable.fromEvent(canvas, 'keydown')
            .filter(function(evt) { return evt.keycode === 32; })
    )
    .sample(200)
    .timestamp();

var heroShots = Rx.Observable
    .combineLatest(
        playerFiring,
        spaceShip,
        function(_shotEvents, _spaceShip) {
            return { 
                timestamp: _shotEvents.timestamp,
                x: _spaceShip.x 
            };
        })
    .distinctUntilChanged(function(shot) { return shot.timestamp; })
    .scan(function(shotArray, shot) {
        shotArray.push(
            {
                x: shot.x, 
                y: HERO_Y
            }
        );
        return shotArray;
    }, []);
    