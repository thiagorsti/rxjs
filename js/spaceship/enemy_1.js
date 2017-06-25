Rx.Observable.combineLatest(starStream, spaceShip, enemies,
    function(_stars, _spaceship, _enemies) {
        return { 
            stars: _stars, 
            spaceship: _spaceship,
            enemies: _enemies
        };
    })    
    .subscribe(renderScene);