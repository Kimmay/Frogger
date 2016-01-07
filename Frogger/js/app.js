// Enemies our player must avoid
var Enemy = function(xloc, yloc, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.yloc = yloc;
    this.xloc = xloc;
    this.speed = speed;
    this.collidedWithPlayer = false;
    this.collisionBuffer = 100; 
    return this;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.xloc > 505) {
        //allEnemies.pop(this);
    } else{
        this.xloc += this.speed * dt;
    }
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xloc, this.yloc);
};

// This is you!
var Player = function(xloc, yloc) {
    this.sprite = 'images/char-cat-girl.png';
    this.xloc = xloc;
    this.yloc = yloc;
    return this;
};

// Update the player position
// Check that we aren't touching any bugs!
Player.prototype.update = function() {
    //check for collisions
    //we only want to check for the area the player's sprite is standing. If a bug goes by behind the player's head, we can assume that if we were in 3D space, they bug would not have touched the player.
    //the random looking numbers were obtained by measuring the image in Photoshop to see where the player's body (collision area) is.
    for (var i = 0; i < allEnemies.length; i++) {
        if(this.xloc + 34 >= allEnemies[i].xloc && this.xloc + 68 <= allEnemies[i].xloc + 101 && this.yloc + 50 >= allEnemies[i].yloc && this.yloc + 121 <= allEnemies[i].yloc + 140 && allEnemies[i].collidedWithPlayer === false) {
            health.decrease();
            allEnemies[i].collidedWithPlayer = true;
            break;
        }
    }
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xloc, this.yloc);
};

// Handles the arrow keys for moving the player around the screen
// Checks for rock positions, player can't move where there are rocks.
Player.prototype.handleInput = function(key) {
    if(this.yloc < 101 && key === 'up' && rockCollision(this.xloc, this.yloc) === false) {
        //we win!
        winner = true;
    }
    if(key === 'left' && this.xloc > 101 && rockCollision(this.xloc - 101, this.yloc) === false) {
        this.xloc -= 101;
    };
    if(key === 'right' && this.xloc < 404 && rockCollision(this.xloc + 101, this.yloc) === false) {
        this.xloc += 101;
    };
    if(key === 'up' && this.yloc > 101 && rockCollision(this.xloc, this.yloc - 85) === false) {
        this.yloc -= 85;
    };
    if(key === 'down' && this.yloc < 404 && rockCollision(this.xloc, this.yloc + 85) === false) {
        this.yloc += 85;
    };

};

// Reset the player back to it's starting position
Player.prototype.reset = function() {
    //default position
    this.xloc = 205;
    this.yloc = 320;
    winner = false;
};

// Object for storing health points. 
// We are using hearts to display health points, Zelda style.
// When they reach zero, you die!
var Health = function(hitPoints) {
    this.sprite = 'images/Heart.png';
    this.hitPoints = hitPoints;
    this.xloc = 0;
    this.yloc = 530;
};

// Draw the health points on the screen
// For each health point the player has, draw a heart
Health.prototype.render = function() {
    for(var i = 0; i < this.hitPoints; i++) {
        ctx.drawImage(Resources.get(this.sprite), this.xloc + (i * 40), this.yloc);
    }
};

// Remove a health point everytime player touches a bug
Health.prototype.decrease = function() {
    this.hitPoints--;
};

// Health points have reached zero. You die now
Health.prototype.isGameOver = function() {
    if(this.hitPoints === 0) {
        return true;
    } else {
        return false;
    }
};

// Object for storing score points.
// Player gets a star for each win they accumulate.
var Score = function() {
    this.sprite = 'images/Star.png';
    this.xloc = 0;
    this.yloc = 500;
    this.points = 0;
};

// Add another win onto the scoreboard
Score.prototype.addWin = function() {
    this.points ++;
};

Score.prototype.getWins = function() {
    return this.points;
};

// After the player dies, reset the scoreboard to 0
Score.prototype.reset = function() {
    this.points = 0;
};

// Draws the stars on the screen. Also displays a text so the person knows what they're looking at.
Score.prototype.render = function() {
    ctx.font = '14pt Arial';
    ctx.fillText("Wins: ", this.xloc, this.yloc);
    //render 1 star for each point
    for(var i = 1; i <= this.points; i++) {
        ctx.drawImage(Resources.get(this.sprite), this.xloc + ((i - 1) * 30), this.yloc);
    }
};

// Obstacles (Rocks) that the Player cannot pass through
var Obstacles = function(xloc, yloc) {
    this.sprite = 'images/Rock.png';
    this.xloc = xloc;
    this.yloc = yloc;
};

Obstacles.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xloc, this.yloc);
};


// Helper function for randomizing bug speed.
// The "80" is just what looks like a good number on screen.
function getSpeed() {
    return (Math.random() + 1) * 80;
};

// Function to populate the allEnemies array with bugs in each of the 3 rows.
function createBugs(){
    var enemies = [];
    //generate row 1 bugs
    var speed = getSpeed();
    for(var i = 1; i < Math.floor(Math.random() * 3 + 1); i++){
        enemies.push(new Enemy((i - 1) * 101, 60, speed));
    }
    
    //generate row 2 bugs
    speed = getSpeed();
    for(var i = 1; i < Math.floor(Math.random() * 3 + 1); i++){
        enemies.push(new Enemy((i - 1) * 101, 146, speed));
    }
    //generate row 3 bugs
    speed = getSpeed();
    for(var i = 1; i < Math.floor(Math.random() * 3 + 1); i++){
        enemies.push(new Enemy((i - 1) * 101, 230, speed));
    }
        return enemies;
};

/* We want the game to get harder as the player wins more games, so we'll
add some obstacles that he cannot pass through. Obviously, the further the
player progresses, the more rocks there should be, but we don't want to get
carried away and add rocks everywhere. */
function addRocks() {
    //reset the current rocks, and add new ones
    rocks = [];
    var rockNumber = Math.floor(Math.random() * score.getWins());
    for(var i = 0; i < rockNumber; i++) {
        var coordinates = getRockPosition(Math.floor(Math.random() * 15) + 1);
        rocks.push(new Obstacles(coordinates[0], coordinates[1]));
    }
};

function getRockPosition(tileNum) {
    var coordinates = [];
    switch(tileNum) {
        case 1:
            coordinates.push(15);
            coordinates.push(90);
            break;
        case 2:
            coordinates.push(115);
            coordinates.push(90);
            break;
        case 3:
            coordinates.push(215);
            coordinates.push(90);
            break;
        case 4:
            coordinates.push(315);
            coordinates.push(90);
            break;
        case 5:
            coordinates.push(415);
            coordinates.push(90);
            break;
        case 6:
            coordinates.push(15);
            coordinates.push(175);
            break;
        case 7:
            coordinates.push(115);
            coordinates.push(175);
            break;
        case 8:
            coordinates.push(215);
            coordinates.push(175);
            break;
        case 9:
            coordinates.push(315);
            coordinates.push(175);
            break;
        case 10:
            coordinates.push(415);
            coordinates.push(175);
            break;
        case 11:
            coordinates.push(15);
            coordinates.push(260);
            break;
        case 12:
            coordinates.push(115);
            coordinates.push(260);
            break;
        case 13:
            coordinates.push(215);
            coordinates.push(260);
            break;
        case 14:
            coordinates.push(315);
            coordinates.push(260);
            break;
        case 15:
            coordinates.push(415);
            coordinates.push(260);
            break;
    }
    return coordinates;
};

// checks to see if the space being moved to is occupied by a rock.
function rockCollision(newXloc, newYloc) {
    for(var i = 0; i < rocks.length; i++) {
        if(newXloc + 34 >= rocks[i].xloc + 7 && newXloc + 68 <= rocks[i].xloc + 66 && newYloc + 131 >= rocks[i].yloc + 50 && newYloc + 141 <= rocks[i].yloc + 117) {
            //rock
            return true;
        } 
    }
    return false;

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = createBugs();

var player = new Player(205, 310);

var health = new Health(4);

var score = new Score();

var rocks = [];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
