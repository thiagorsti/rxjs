var SHOOTING_SPEED = 15;
var SCORE_INCREASE = 10;

var scoreSubject = new Rx.Subject();
var score = scoreSubject.scan(
    function(prev, cur){
        return prev + cur;
    }, 0)
    .startWith(0);

function paintHeroShots(heroShots, enemies) {    
    heroShots.forEach(function(shot, i){
        for (var l=0; l < enemies.length; l++) {
            var enemy = enemies[l];
            if (!enemy.isDead && collision(shot, enemy)) {
                scoreSubject.onNext(SCORE_INCREASE);
                enemy.isDead = true;
                shot.x = shot.y = -100;
                break;
            }
        }
        shot.y -= SHOOTING_SPEED;
        drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
    });
}

function paintScore(score) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Score: ' + score, 40, 43);
}