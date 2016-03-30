/*-----------------------------------------------------------------
 * app.js                        Updated 20-02-2016 by Asger Søvsø
 * app.js contains enemy, player, collectibles classes and screen
 * overlay for the classic arcade game frogger.
 * It is created as a part of the Udacity Front End Web Developer
 * Nanodegree.
 * The app.js was originally acquired from:
 * https://github.com/udacity/frontend-nanodegree-arcade-game
 * (commit 5a526c0c6d9a69d8dbb45f32546b5d0068abdb8b)
 *----------------------------------------------------------------- */
'use strict';

/* Initial overlay settings and declaration of scores. */
var showWelcome = true;
var showGameOver = false;
var showCurrentScore = false;
var showHighScore = false;
var highScore = 0;
var lastScore = 0;

/* Class for creating the enemies the player must avoid.
 * The row input is for setting what row the enemy will spawn.
 * sprite is the enemy icon/graphic */
var Enemy = function(row) {
    this.sprite = 'images/enemy-bug.png';
    this.x = - 150;
    this.y = 60 + 83 * (row - 1);
    this.speed = (Math.random() + 0.35) * 300;
};
/* Function to update the enemy position.
 * The dt input is the delta time between animation updates.
 * Whenever an enemy leaves the screen it is removed from the allEnemies
 * array, and new enemies are spawned. Amount of new enemies depends on
 * a random number and the amount of enemies. */
Enemy.prototype.update = function(dt) {
    this.x += this.speed*dt;
    if (this.x > ctx.canvas.width) {
        if (allEnemies.length < 4) {
            Enemy.prototype.newEnemy(Math.floor(Math.random() * 2)+1);
        } else {
            Enemy.prototype.newEnemy(Math.floor(Math.random() * 2));
        }
        allEnemies.splice(allEnemies.indexOf(this),1);
    }
};
/* Function for spawning new enemies at a random row.
 * The num input is the number of new enemies to be spawned. */
Enemy.prototype.newEnemy = function(num) {
    for (var i = 0; i < num; i++) {
        allEnemies.push(new Enemy(Math.floor(Math.random() * 3) + 1));
    }
};
/* Function for rendering the the enemies. The function draws the enemy
 * graphic onto the canvas, created in the engine.js file. */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Class for creating the player.
 * sprite is the player icon/graphic */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = Math.floor(ctx.canvas.width / 2 - 101 / 2);
    this.y = 383;
    this.score = 0;
};
/* Function that runs every animation update.
 * It initiates a check to see if the player is hit by an enemy. */
Player.prototype.update = function() {
    this.checkCollisions();
};
/* Function for checking if the player gets hit by an enemy.
 * For each enemy it checks if the player is within 50px, if true it's
 * game over. */
Player.prototype.checkCollisions = function() {
    self = this;
    allEnemies.forEach(function(enemy) {
            if (Math.abs(enemy.x - self.x) < 50 && Math.abs(enemy.y - self.y) < 50) {
                self.gameOver();
            }
        });
};
/* Function for rendering the the player. The function draws the player
 * graphic onto the canvas, created in the engine.js file. */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/* Function to take action when a key is pressed. The function only acts
 * on the arrow keys (the key input is converted to a string in the eventlistener
 * further down in the code).
 * The function moves the player by changing its coordinates. given that the player
 * is not trying to move outside the level.
 * If the player moves to the water, it's game over.
 * Whenever a key is pressed the inputAction function is called to set the right
 * overlay text */
Player.prototype.handleInput = function(key) {
    if (key === 'up') {
        this.y -= 83;
        this.inputAction();
        if (this.y < 0) {
            this.gameOver();
        }
    } else if (key === 'down' && this.y < ctx.canvas.height - 223) {
        this.y += 83;
        this.inputAction();
    } else if (key === 'right' && this.x < ctx.canvas.width - 101) {
        this.x += 101;
        this.inputAction();
    } else if (key === 'left' && this.x > 0) {
        this.x -= 101;
        this.inputAction();
    }
};
/* Function to show hide the starting and game over overlay text and show the
 * current score and high score overlay text, whenever a valid key is pressed */
Player.prototype.inputAction = function() {
    showWelcome = false;
    showGameOver = false;
    showCurrentScore = true;
    showHighScore = true;
};
/* Function run when game over. It shows the game over overlay text, hides the
 * current score overlay text and resets the game. */
Player.prototype.gameOver = function() {
    showGameOver = true;
    showCurrentScore = false;
    reset();
};

/* Class for creating the gem collectibles.
 * sprite is the gem icon/graphic.
 * The position and icon is generated at random every time a new instance of the
 * class is created. */
var Gem = function() {
    this.sprite = this.icons()[Math.floor(Math.random() * 3)];
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = Math.floor(Math.random() * 3) * 83 + 50;
};
/* Function for rendering the the gem. The function draws the gem
 * graphic onto the canvas, created in the engine.js file. */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/* Function that returns a array containing the gem icons/graphics */
Gem.prototype.icons = function() {
    return ['images/gem-blue.png', 'images/gem-orange.png', 'images/gem-green.png'];
};
/* Function for checking if the player reaches a gem.
 * If the player reaches a gem, the old gem gets replaced with a new
 * gem and the current score is increased by 1. If a new high score is
 * reached that will be updated as well */
Gem.prototype.checkCollisions = function() {
    if (Math.abs(gem.x - player.x) < 50 && Math.abs(gem.y - player.y) < 50 ) {
        gem = new Gem();
        player.score ++;
        if (player.score > highScore) {
            highScore = player.score;
        }
    }
};
/* Function that runs every animation update.
 * It initiates a check to see if the player reaches a gem. */
Gem.prototype.update = function() {
    this.checkCollisions();
};

/* The enemies, gem and player are initiated. 3 enemies are spawned
 * one in each row. */
var allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
var player = new Player();
var gem = new Gem();

/* Function to reset the game. New enemies, gem and player are initiated.
 * 3 enemies are spawned one in each row.
 * The player score is saved to the variable lastScore, in order to be able
 * to show the latest score at the game over overlay text */
var reset = function() {
    lastScore = player.score;
    allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
    player = new Player();
    gem = new Gem();
};

/* A function containing the "Start Screen". The "Start Screen" draws overlay
 * text and pictures to be shown when the game starts (the message only shows
 * when the showWelcome is true). */
var welcomeMsg = function() {
    var text = 'Move to start';
    if (showWelcome) {
        ctx.drawImage(Resources.get('images/keys.png'), 165, 300);
        ctx.font = 'bold 60px Impact';
        ctx.textAlign = 'center';
        ctx.fillStyle='#ffffff';
        ctx.lineWidth=3;
        ctx.fillText(text, ctx.canvas.width / 2, 270);
        ctx.strokeText(text, ctx.canvas.width / 2, 270);
    }
};

/* A function containing the "Game Over Screen". The "Game Over Screen" draws overlay
 * text and pictures to be shown when the player dies (the message only shows
 * when the showGameOver is true).
 * The score input is the latest score to be shown. */
var gameOverMsg = function(score) {
    var text = 'Score: ' + score;
    if (showGameOver) {
        ctx.drawImage(Resources.get('images/keys.png'), 165, 300);
        ctx.font = 'bold 60px Impact';
        ctx.textAlign = 'center';
        ctx.fillStyle='#ffffff';
        ctx.lineWidth=3;
        ctx.fillText('Game Over', ctx.canvas.width / 2, 150);
        ctx.strokeText('Game Over', ctx.canvas.width / 2, 150);
        ctx.fillText(text, ctx.canvas.width / 2, 270);
        ctx.strokeText(text, ctx.canvas.width / 2, 270);
    }
};

/* A function containing the score counter. The score counter draws overlay
 * text to be shown when the game is running (the message only shows
 * when the showScore is true). */
var showScore = function(score) {
    var text = 'Score: ' + score;
    if (showCurrentScore) {
        ctx.font = '30px Impact';
        ctx.fillStyle='#ffffff';
        ctx.textAlign = 'left';
        ctx.lineWidth=2;
        ctx.fillText(text, 5, 90);
        ctx.strokeText(text, 5, 90);
    }
};

/* A function containing the high score counter. The score counter draws overlay
 * text to be shown after the first valid keystroke (the message only shows
 * when the showHighScore is true). */
var renderHighScore = function() {
    var text = 'Highscore: ' + highScore;
    if (showHighScore) {
        ctx.font = '30px Impact';
        ctx.fillStyle='#ffffff';
        ctx.textAlign = 'right';
        ctx.lineWidth=2;
        ctx.fillText(text, 500, 90);
        ctx.strokeText(text, 500, 90);
    }
};

/* Eventlisetener that calls player.haldleInput, however it will only pass through
 * valid keys (the arrow keys). */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});