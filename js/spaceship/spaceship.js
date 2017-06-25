Rx.Observable.combineLatest(starStream, spaceShip, enemies, heroShots, score,
    function(_stars, _spaceship, _enemies, _heroShots, _score) {
        return { 
            stars: _stars, 
            spaceship: _spaceship,
            enemies: _enemies,
            heroShots: _heroShots,
            score: _score
        };
    })
    .sample(SPEED)
    .takeWhile(function(actors){        
        return gameOver(actors.spaceship, actors.enemies) === false;
    })
    .subscribe(renderScene);