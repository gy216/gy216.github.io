/*
/*  HTML 5 game
/*  Asteroid Armagedon
/*  date: 18.12.2012
/*  by Viktor Ivanov
*/

(function() {

    "use strict";

    // addEventListener
    function addEventHandler(oNode, sEvt, fFunc, bCaptures) {
        if (oNode.addEventListener) {
            oNode.addEventListener(sEvt, fFunc, bCaptures);
        } else {
            oNode.attachEvent("on" + sEvt, fFunc);
        }
    }
    
    /*
    Setup scene
    */

    var bgm = new Audio("audio/background.mp3");

    var FPS = 60;
    var countGameFrames = 0;
    var stopGame = false;

    var mouseX;
    var mouseY;

    var leyar1Draw1 = 0;
    var leyar1Draw2 = 1920;
    var leyar2Draw1 = 0;
    var leyar2Draw2 = 1920;

    var canvasField = document.getElementById("game-field");
    var ctx = canvasField.getContext("2d");
    var isPlaying = false;
    var requestAnimFrame = window.requestAnimationFrame ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame ||
                           window.oRequestAnimationFrame ||
                           window.msRequestAnimationFrame ||
                           function(callback) {
                                window.setTimeout(callback, 1000/ FPS);
                           };
    var bigRockSpeed = 1;
    var middleRockSpeed = 1;
    var smallRockSpeed = 1;
    var rocksArr = [];
    var bonusArr = [];
    var spawnAmount = 3;
    var gameLevel = 1;
    var displayGameLevelFrame = 20;
    var showGameLevel = false;

    var gameWidth = canvasField.width;
    var gameHeight = canvasField.height;

    var imgSprite = new Image();
    imgSprite.src = 'img/sprite.png';

    // General sprite class
    function Sprite(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        this.source = source;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.dx = dx;
        this.dy = dy;
        this.dw = dw;
        this.dh = dh;

    };

    Sprite.prototype.draw = function (ctx) {
        ctx.drawImage(this.source, this.sx, this.sy, this.sw, this.sh,
	        this.dx, this.dy, this.dw, this.dh);
    };
    
    // Class for player ship
    GameMenu.prototype = new Sprite();
    GameMenu.prototype.constructor = GameMenu;

    function GameMenu() {
        Sprite.apply(this, arguments);
    }

    // Class for player ship
    MainShip.prototype = new Sprite();
    MainShip.prototype.constructor = MainShip;

    function MainShip(source, sx, sy, sw, sh, dx, dy, dw, dh,
        moveX, moveY, lives, speed, demage, weapon) {

        Sprite.apply(this, arguments);

        this.moveX = moveX;
        this.moveY = moveY;
        this.lives = lives;
        this.speed = speed;
        this.demage = demage;
        this.weapon = weapon;
        this.weaponSpeed = 0;
        this.leftX = this.dx;
        this.rightX = this.dx + this.dw;
        this.topY =  this.dy;
        this.bottomY = this.dy + this.dh;
        this.isUpKey = false;
        this.isRightKey = false;
        this.isDownKey = false;
        this.isLeftKey = false;
        this.isSpacebar = false;
        this.isShooting = false;
        this.bullets = [];
        this.currentBullet = 0;
        this.noseX = this.dx + 38;
        this.noseY = this.dy + 15;
        this.moveDirection = "default";
        this.immortalShip = false;
        this.immortalFrame = 0;
        this.totalFrame = 120;
        this.score = 0;
        this.clearOldBullets = false;
        this.floatyText = new FloatyText();
        this.explosion = new Explosion(imgSprite, 589, 352, 58, 58, 
                                        0, 0, 58, 58);
        this.weaponSound = "fire";
        this.chargeBullets();
    };

    MainShip.prototype.chargeBullets = function() {
        for (var i = 0; i < 20; i++) {
            if (this.weapon === "startWeapon") {
                this.demage = 1;
                this.weaponSpeed = 8;
                this.bullets[this.bullets.length] = new Bullet(imgSprite, 211, 365, 12, 6, 
                                                            this.noseX, this.noseY, 12, 6);
                this.weaponSound = "fire";  
            } else if (this.weapon === "rockets") {
                this.bullets[this.bullets.length] = new Bullet(imgSprite, 206, 418, 16, 16, 
                                                            this.noseX, this.noseY, 16, 16);
                this.demage = 3;
                this.weaponSpeed = 4.5;
                this.weaponSound = "fireRockets";
                this.clearOldBullets = true;
            }
            
        }
        if (this.clearOldBullets) {
            this.bullets.splice(0, 20);
        };
    };

    MainShip.prototype.directions = function () {

        if (this.isUpKey && this.topY > 0) {
            this.dy -= this.speed;
            this.moveDirection = "top";
        }
        if (this.isDownKey && this.bottomY < gameHeight) {
            this.dy += this.speed;
            this.moveDirection = "bottom";
        }
        if (this.isRightKey && this.rightX < gameWidth) {
            this.dx += this.speed;
            this.moveDirection = "right";
        } 
        if (this.isLeftKey && this.leftX > 0) {
            this.dx -= this.speed;
            this.moveDirection = "left";
        } 
        if (!(this.isUpKey) && !(this.isRightKey) && !(this.isDownKey) && !(this.isLeftKey)) {
            playerShip.moveDirection = "default";
        }

        switch(this.moveDirection) {
            case "left":
            this.sx = 315;
            break;
            case "right":
            this.sx = 272;
            break;
            case "top":
            this.sx = 315;
            this.sy = 401;
            break;
            case "bottom":
            this.sx = 315;
            this.sy = 401;
            break;

            case "default":
            this.sx = 315;
            this.sy = 358;
            break;

            default:
            break;
        }

        this.checkLives();
        this.getBonus();
        this.checkIsShipHit();
        this.updateCoors(); 
        this.checkShooting();
        this.drawAllBullets();

    };

    MainShip.prototype.checkLives = function() {
        if (this.lives <= 0) {
            gameOver();
        } else if (this.explosion.hasHit) {
             this.explosion.directions();
             this.immortalShip = true;
        }
    };  

    MainShip.prototype.updateCoors = function() {
        this.noseX = this.dx + 38;
        this.noseY = this.dy + 13;
        this.leftX = this.dx;
        this.rightX = this.dx + this.dw;
        this.topY =  this.dy;
        this.bottomY = this.dy + this.dh;
    };

    MainShip.prototype.drawAllBullets = function() {
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].dx >= 0) {
                this.bullets[i].draw(ctx);
                this.bullets[i].directions();
            }
            if (this.bullets[i].explosion.hasHit) {
                this.bullets[i].explosion.directions();
            }
            if (this.bullets[i].floatyText.hasHit) {
                this.bullets[i].floatyText.render();       
            }
        }
    };

    MainShip.prototype.checkShooting = function() {
        if (this.isSpacebar && !this.isShooting) {
            this.isShooting = true;
            this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
            this.currentBullet++;
            if (this.currentBullet >= this.bullets.length) {
                this.currentBullet = 0;
            }
            
        } else if (!this.isSpacebar) {
            this.isShooting = false;
        }
    };

    MainShip.prototype.checkIsShipHit = function() {
        for (var i = 0; i < rocksArr.length; i++) {
            if (!this.immortalShip) {
                if (this.dx + 20 >= rocksArr[i].dx && 
                    this.dx + 20 <= rocksArr[i].dx + rocksArr[i].dw &&
                    this.dy + 20 >= rocksArr[i].dy - 13 &&
                    this.dy + 20 <= rocksArr[i].dy + rocksArr[i].dh + 13) {
                    
                    this.explosion.dx = rocksArr[i].dx - (this.explosion.dw / 2);
                    this.explosion.dy = rocksArr[i].dy;
                    this.explosion.hasHit = true;  
                    playAudio("shipExplosion");
                    this.lives -= 1;

                    this.recycleShip(); 
                }
            }
        }
    };

    MainShip.prototype.getBonus = function() {
        for (var i = 0; i < bonusArr.length; i++) {
            if (bonusArr[i].bonusDraw) {
                this.floatyText.dx = this.dx - (this.dw / 2);
                this.floatyText.dy = this.dy; 

                if (this.dx + 20 >= bonusArr[i].dx && 
                    this.dx + 20 <= bonusArr[i].dx + bonusArr[i].dw &&
                    this.dy + 20 >= bonusArr[i].dy - 13 &&
                    this.dy + 20 <= bonusArr[i].dy + bonusArr[i].dh + 13) {
                    playAudio("bonus");
                    if (bonusArr[i].bonusType === "weapon") {
                        this.weapon = bonusArr[i].bonusName;
                        this.chargeBullets();
                        this.floatyText.myText = "rockets";
                        this.floatyText.hasHit = true;
                    } 
                    if (bonusArr[i].bonusType === "shipSpeed") {
                        this.speed += 1;
                        this.floatyText.myText = "speed";
                        this.floatyText.hasHit = true;
                    } 
                    if (bonusArr[i].bonusType === "superBonus") {
                        this.totalFrame = 800;
                        this.immortalShip = true;
                        this.floatyText.myText = "immortal ship";
                        this.floatyText.hasHit = true;
                    } 
                    if (bonusArr[i].bonusType === "live") {
                        this.lives += 1;
                        this.floatyText.myText = "+1 live";
                        this.floatyText.hasHit = true;
                    } 
                    if (bonusArr[i].bonusType === "score") {
                        this.score += 1000;
                        this.floatyText.myText = "+ 1000 points";
                        this.floatyText.hasHit = true;
                    } 
                    bonusArr[i].bonusDraw = false;
                    bonusArr[i].recycle();
                }
            }
        }
        if (this.floatyText.hasHit) {
                this.floatyText.render();
        }
    };

    MainShip.prototype.recycleShip = function () {
        this.dx = 0;
    };

    MainShip.prototype.newLiveTurn = function () {
        if (this.immortalFrame <= this.totalFrame) {
            this.immortalFrame++;
        } else {
            this.immortalFrame = 0;  
            this.totalFrame = 160;
            this.immortalShip = false;
        }
    };
    
    // Class for BonusStuff
    BonusStuff.prototype = new Sprite();
    BonusStuff.prototype.constructor = BonusStuff;

    function BonusStuff(source, sx, sy, sw, sh, dx, dy, dw, dh, bonusType, bonusName) {
        Sprite.apply(this, arguments);
        this.bonusDraw = false;
        this.bonusName = bonusName;
        this.bonusType = bonusType;
        this.getBonus();
    };

    BonusStuff.prototype.getBonus = function () {
        if (this.bonusDraw) {
            this.dx -= 0.4;
            this.draw(ctx);
        } else {
            this.bonusDraw = false;
        }
    };

    BonusStuff.prototype.recycle = function () {
        this.dx = 670;
        this.dy = Math.floor(Math.random() * gameHeight - 40);
    };

    // Class for bullet
    Bullet.prototype = new Sprite();
    Bullet.prototype.constructor = Bullet;

    function Bullet() {
        Sprite.apply(this, arguments);
        this.dx = -20;
        this.explosion = new Explosion(imgSprite, 589, 352, 58, 58, 
                                        0, 0, 58, 58);
        this.floatyText = new FloatyText();
    };

    Bullet.prototype.directions = function () {
        this.dx += playerShip.weaponSpeed;
        this.checkHitRock();
        if (this.dx > gameWidth) {
            this.recycle();
        };
    };

    Bullet.prototype.fire = function (startX, startY) {
        playAudio(playerShip.weaponSound);

        this.dx = startX;
        this.dy = startY;
    };

    Bullet.prototype.checkHitRock = function () {

        for (var i = 0; i < rocksArr.length; i++) {
            if (this.dx >= rocksArr[i].dx && 
                this.dx <= rocksArr[i].dx + rocksArr[i].dw &&
                this.dy >= rocksArr[i].dy &&
                this.dy <= rocksArr[i].dy + rocksArr[i].dh) {

                playAudio("hitRock");

                rocksArr[i].healt -=  playerShip.demage;
                
                if (rocksArr[i].healt <= 0) {

                    playAudio("explosion");

                    if (rocksArr[i].rocktype == "big") {
                        playerShip.score += 20;
                        this.floatyText.myText = "+ 20";
                        rocksArr[i].healt =  rocksArr[i].bigRockHealt;
                    }
                    if (rocksArr[i].rocktype == "middle") {
                        playerShip.score += 50;
                        this.floatyText.myText = "+ 50";
                        rocksArr[i].healt =  rocksArr[i].middleRockHealt;
                    }
                    if (rocksArr[i].rocktype == "small") {
                        playerShip.score += 100;
                        this.floatyText.myText = "+ 100";
                        rocksArr[i].healt =  rocksArr[i].smallRockHealt;
                    }
                    this.floatyText.dx = rocksArr[i].dx - (this.explosion.dw / 2);
                    this.floatyText.dy = rocksArr[i].dy; 
                    this.floatyText.hasHit = true;

                    this.explosion.dx = rocksArr[i].dx - (this.explosion.dw / 2);
                    this.explosion.dy = rocksArr[i].dy;
                    this.explosion.hasHit = true;                
                    rocksArr[i].recycleRock();
                    
                }
                this.recycle();
            }
        }
    };

    Bullet.prototype.recycle = function () {
        this.dx = -20;
    };

    // Class for Explosion
    Explosion.prototype = new Sprite();
    Explosion.prototype.constructor = Explosion;

    function Explosion() {
        Sprite.apply(this, arguments);

        this.hasHit = false;
        this.currentFrame = 0;
        this.totalFrame = 10;
    }

    Explosion.prototype.directions = function () {
        if (this.currentFrame <= this.totalFrame) {
            this.draw(ctx);
            this.currentFrame++;
        } else {
            this.hasHit = false;
            this.currentFrame = 0;
        }
    };

    // Class for rocks
    Rock.prototype = new Sprite();
    Rock.prototype.constructor = Rock;
    
    function Rock(source, sx, sy, sw, sh, dx, dy, dw, dh,
        moveX, moveY, healt, speed, rocktype) {

        Sprite.apply(this, arguments);

        this.moveX = moveX;
        this.moveY = moveY;
        this.healt = healt;
        this.speed = speed;
        this.rocktype = rocktype;
        this.bigRockScore = 2;
        this.middleRockScore = 5;
        this.smallRockScore = 10;

        this.bigRockHealt = 4;
        this.middleRockHealt = 2;
        this.smallRockHealt = 1;
    };

    Rock.prototype.directions = function () {
        this.dx -= this.speed;
        this.checkEscaped();
    };

    Rock.prototype.checkEscaped = function() {
        if (this.dx <= -2000) {
            this.recycleRock();
        };
    };

    Rock.prototype.recycleRock = function() {
        this.dx = Math.floor(Math.random() * 1000) + gameWidth;
        this.dy = Math.floor(Math.random() * gameHeight);
    };

    // Class for background layers
    LeyarBackground.prototype = new Sprite();
    LeyarBackground.prototype.constructor = LeyarBackground;

    function LeyarBackground(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        Sprite.apply(this, arguments);
    };

    // Class for background layers
    GameHUD.prototype = new Sprite();
    GameHUD.prototype.constructor = GameHUD;

    function GameHUD(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        Sprite.apply(this, arguments); 
    };

    GameHUD.prototype.displayScore = function() {
        ctx.fillStyle = "white";
        ctx.font = '16px Tahoma';
        ctx.textBaseline = 'top';
        ctx.fillText("Score: " + playerShip.score, 10, 5);
        ctx.fillText("Lives: " + playerShip.lives, 570, 5);
        ctx.fillText("music: on/ off", 400, 5);
    };

    function FloatyText()
    {
       this.myText = "0";
       this.dx = 0;
       this.dy = 0;
       this.myVelX = -1;
       this.myVelY = -1;
       this.myFrameCounter = 0;
       this.myDuration = 40;
       this.hasHit = false;
    }

    FloatyText.prototype.render = function()
    {
       if (this.myFrameCounter < this.myDuration) {
           ctx.fillStyle = "#12fc33";
           ctx.font = "10pt Helvetica";
           ctx.fillText(this.myText, this.dx + 30, this.dy);
           this.dx += this.myVelX;
           this.dy += this.myVelY;
           this.myFrameCounter++;
        } else {
            this.hasHit = false;
            this.myFrameCounter = 0;
        }
    }

    // Class for start game button
    function Button(xL, xR, yT, yB) {
        this.xLeft = xL;
        this.xRight = xR;
        this.yTop = yT;
        this.yBottom = yB;
    }

    Button.prototype.checkClicked = function() {
        if (this.xLeft <= mouseX && mouseX <= this.xRight &&
            this.yTop <= mouseY && mouseY <= this.yBottom) {
            return true;
        }
    }


    // Creating Game objects
    // ---------------------------------------------------------------------------------------------------------------
    var leyar_1Backgound1 = new LeyarBackground(imgSprite, 0, 0, 1920, gameHeight, leyar1Draw1, 0, 1920, gameHeight);
    var leyar_1Backgound2 = new LeyarBackground(imgSprite, 0, 0, 1920, gameHeight, leyar1Draw2, 0, 1920, gameHeight);

    var leyar_2Backgound1 = new LeyarBackground(imgSprite, 0, 930, 1920, gameHeight, leyar2Draw1, 0, 1920, gameHeight);
    var leyar_2Backgound2 = new LeyarBackground(imgSprite, 0, 930, 1920, gameHeight, leyar2Draw2, 0, 1920, gameHeight);

    var gameMenu = new GameMenu(imgSprite, 0, 500, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
    var gameHud = new GameHUD(imgSprite, 0, 0, 0, 0, 0, 0, 0, 0);

    var playerShip = new MainShip(imgSprite, 314, 401, 40, 42, 10, 150, 40, 42,
        200, 200, 2, 1, 1, "startWeapon");

    bonusArr[0] = new BonusStuff(imgSprite, 122, 362, 23, 21, 680, 200, 23, 21, "weapon" , "rockets");
    bonusArr[1] = new BonusStuff(imgSprite, 122, 384, 23, 21, 680, 220, 23, 21, "shipSpeed" , "speed");
    bonusArr[2] = new BonusStuff(imgSprite, 122, 404, 23, 21, 680, 100, 23, 21, "superBonus" , "immortal");
    bonusArr[3] = new BonusStuff(imgSprite, 122, 424, 23, 21, 680, 150, 23, 21, "live" , "live");
    bonusArr[4] = new BonusStuff(imgSprite, 122, 445, 23, 21, 680, 120, 23, 21, "score" , "immortal");

    var btnPlay = new Button(245, 385, 150, 213);
    var btnMusicOn = new Button(452, 472, 0, 50);
    var btnMusicOff = new Button(473, 493, 0, 50);
    // ---------------------------------------------------------------------------------------------------------------

    function init() {
        spawnRocks(spawnAmount);    
        gameMenu.draw(ctx);
        addEventHandler(document.getElementById("game-field"), "click", mouseClicked, false);
    }

    function gameOver() {
        ctx.fillStyle = "white";
        ctx.font = '36px Tahoma';
        ctx.textBaseline = 'top';
        ctx.fillText("Game Over", 220, 100);
        ctx.fillStyle = "#12fc33";
        ctx.font = '24px Tahoma';
        ctx.fillText("Your score " + playerShip.score, 225, 140);
        stopLoop();
    }

    function gameWin() {
        ctx.fillStyle = "white";
        ctx.font = '28px Tahoma';
        ctx.textBaseline = 'top';
        ctx.fillText("CONGRATULATIONS YOU WIN THE GAME", 60, 100);
        ctx.fillStyle = "#12fc33";
        ctx.font = '24px Tahoma';
        ctx.fillText("Your score " + playerShip.score, 225, 140);
    }

    function playAudio(source) {
        var sound;
        if(sound != undefined) {
           sound.pause();
        }
        sound = new Audio("audio/" + source + ".ogg");
        sound.play();
    }

    function displayGameLevel() {
        if (displayGameLevelFrame < 100) {
            showGameLevel = true;
            ctx.textBaseline = 'top';
            ctx.fillStyle = "#12fc33";
            ctx.font = '24px Tahoma';
            ctx.fillText("Level " + gameLevel, 275, 140);
            displayGameLevelFrame++;
        } else {
            displayGameLevelFrame = 0;
            showGameLevel = false;
        }
    }

    function moveBackground() {
        leyar_1Backgound1.dx -= 0.8;
        leyar_1Backgound2.dx -= 0.8;

        leyar_2Backgound1.dx -= 1.5;
        leyar_2Backgound2.dx -= 1.5;

        if (leyar_1Backgound1.dx <= -1920) {
            leyar_1Backgound1.dx = 1920;
        } else if (leyar_1Backgound2.dx <= -1920) {
            leyar_1Backgound2.dx = 1920;
        }

        if (leyar_2Backgound1.dx <= -1920) {
            leyar_2Backgound1.dx = 1920;
        } else if (leyar_2Backgound2.dx <= -1920) {
            leyar_2Backgound2.dx = 1920;
        }

        leyar_1Backgound1.draw(ctx);
        leyar_1Backgound2.draw(ctx);
        leyar_2Backgound1.draw(ctx);
        leyar_2Backgound2.draw(ctx);
    }

    function spawnRocks(num) {
        for (var i = 0; i < num; i++) {
            
            if (gameLevel > 0 && gameLevel < 11) {
            rocksArr[rocksArr.length] = new Rock(imgSprite, 55, 362, 56, 60, Math.floor(Math.random() * 1000) + gameWidth, Math.floor(Math.random() * gameHeight), 56, 60,
                                                 200, 200, 3, Math.floor(Math.random() * i + bigRockSpeed), "big");
            rocksArr[rocksArr.length] = new Rock(imgSprite, 70, 466, 15, 15, Math.floor(Math.random() * 1000) + gameWidth, Math.floor(Math.random() * gameHeight), 15, 15,
                                                 200, 200, 1, Math.floor(Math.random() * i + smallRockSpeed - 2), "small");
            }
            if (gameLevel > 1 && gameLevel < 11) {
            rocksArr[rocksArr.length] = new Rock(imgSprite, 0, 362, 56, 60, Math.floor(Math.random() * 1000) + gameWidth, Math.floor(Math.random() * gameHeight), 56, 60,
                                                 200, 200, 3, Math.floor(Math.random() * i + bigRockSpeed), "big"); 
            }
            if (gameLevel > 2 && gameLevel < 11) {
            rocksArr[rocksArr.length] = new Rock(imgSprite, 12, 420, 30, 30, Math.floor(Math.random() * 1000) + gameWidth, Math.floor(Math.random() * gameHeight), 30, 30,
                                                 200, 200, 2, Math.floor(Math.random() * i + middleRockSpeed), "middle"); 
            }
            if (gameLevel > 3 && gameLevel < 11) {
            rocksArr[rocksArr.length] = new Rock(imgSprite, 60, 423, 35, 35, Math.floor(Math.random() * 1000) + gameWidth, Math.floor(Math.random() * gameHeight), 35, 35,
                                                 200, 200, 2, Math.floor(Math.random() * i + middleRockSpeed - 1), "middle"); 
            }
            if (gameLevel > 4 && gameLevel < 11) {
            rocksArr[rocksArr.length] = new Rock(imgSprite, 15, 454, 25, 25, Math.floor(Math.random() * 1000) + gameWidth, Math.floor(Math.random() * gameHeight), 25, 25,
                                                 200, 200, 1, Math.floor(Math.random() * i + smallRockSpeed - 2), "small"); 
            } 
        };
    }

    function drawAllRocks(ctx) {
        for (var i = 0; i < rocksArr.length; i++) {
            rocksArr[i].draw(ctx);
            rocksArr[i].directions();
        };
    }

    function playGame() {
        startLoop();

        // Play background music
        bgm.play();
        bgm.volume = 0.4;
        bgm.loop = true;

        addEventHandler(window, "keydown", checkKeyDown, false);
        addEventHandler(window, "keyup", checkKeyUp, false);
    }
    
    function checkGameLevel() {
    
        if (countGameFrames == 1500) {
            bigRockSpeed = 2;
            spawnRocks(4);
            gameLevel = 2;
            showGameLevel = true;
            bonusArr[1].bonusDraw = true; 
        }
        if (countGameFrames == 3000) {
            bigRockSpeed = 3;
            spawnRocks(4);
            gameLevel = 3;
            showGameLevel = true;
            bonusArr[4].bonusDraw = true; 
        }
        if (countGameFrames == 4500) {
            bigRockSpeed = 3;
            middleRockSpeed = 2;
            spawnRocks(4);
            gameLevel = 4;
            showGameLevel = true;
            bonusArr[1].bonusDraw = true; 
        }
        if (countGameFrames == 6000) {
            bigRockSpeed = 3;
            middleRockSpeed = 2;
            smallRockSpeed = 1;
            spawnRocks(4);
            gameLevel = 5;
            showGameLevel = true;
            bonusArr[0].bonusDraw = true; 
        }
        if (countGameFrames == 7500) {
            bigRockSpeed = 4;
            middleRockSpeed = 3;
            smallRockSpeed = 2;
            spawnRocks(5);
            gameLevel = 6;
            showGameLevel = true;
            bonusArr[1].bonusDraw = true; 
        }
        if (countGameFrames == 9000) {
            bigRockSpeed = 3;
            middleRockSpeed = 3;
            smallRockSpeed = 2;
            spawnRocks(5);
            gameLevel = 7;
            showGameLevel = true;
            bonusArr[2].bonusDraw = true; 
        }
        if (countGameFrames == 10500) {
            bigRockSpeed = 4;
            middleRockSpeed = 3;
            smallRockSpeed = 2;
            spawnRocks(5);
            gameLevel = 8;
            showGameLevel = true;
            bonusArr[4].bonusDraw = true; 
        }
        if (countGameFrames == 12000) {
            bigRockSpeed = 4;
            middleRockSpeed = 4;
            smallRockSpeed = 3;
            spawnRocks(5);
            gameLevel = 9;
            showGameLevel = true;
            bonusArr[3].bonusDraw = true; 
        }
        if (countGameFrames == 13500) {
            bigRockSpeed = 4;
            middleRockSpeed = 4;
            smallRockSpeed = 4;
            spawnRocks(6);
            gameLevel = 10;
            showGameLevel = true;
            bonusArr[3].bonusDraw = true; 
        }
        if (countGameFrames >= 15000) {
            bigRockSpeed = 0;
            middleRockSpeed = 0;
            smallRockSpeed = 0;
            spawnRocks(0);
            rocksArr.splice(0,3);
            gameWin();
        }
    }

    function bonuses() {
        for (var i = 0; i < bonusArr.length; i++) {
            bonusArr[i].getBonus();
        };
    }

    function loop() {
        if (isPlaying) {
            ctx.clearRect(0, 0, gameWidth, gameHeight);

            moveBackground();
            drawAllRocks(ctx);
            bonuses();
            playerShip.directions();

            if (playerShip.immortalShip) {
                ctx.globalAlpha = 0.4;
                playerShip.newLiveTurn();
                playerShip.draw(ctx);
                ctx.globalAlpha = 1.0;
            } else {
                playerShip.draw(ctx);
            }

            gameHud.displayScore();
            checkGameLevel();

            if (showGameLevel) {
                displayGameLevel();
            }

            countGameFrames++;
            requestAnimFrame(loop);
        }
    }

    function startLoop() {
        isPlaying = true;
        loop();
    }

    function stopLoop() {
        isPlaying = false;
        stopGame = true;
    }

    function checkKeyDown(e) {
        var keyID = e.keyCode || e.which;
        // Up or W key
        if (keyID === 38 || keyID === 87) {
            playerShip.isUpKey = true;
            e.preventDefault();
        }
        // Right or D key
        if (keyID === 39 || keyID === 68) {
            playerShip.isRightKey = true;
            e.preventDefault();
        }
        // Down or S key
        if (keyID === 40 || keyID === 83) {
            playerShip.isDownKey = true;
            e.preventDefault();
        }
        // Left or A key
        if (keyID === 37 || keyID === 65) {
            playerShip.isLeftKey = true;
            e.preventDefault();
        }
        // Space
        if (keyID == 32) {
            playerShip.isSpacebar = true;
            e.preventDefault();
        }
    }

    function checkKeyUp(e) {
        var keyID = e.keyCode || e.which;
        // Up or W key
        if (keyID === 38 || keyID === 87) {
            playerShip.isUpKey = false;
            e.preventDefault();
        }
        // Right or D key
        if (keyID === 39 || keyID === 68) {
            playerShip.isRightKey = false;
            e.preventDefault();
        }
        // Down or S key
        if (keyID === 40 || keyID === 83) {
            playerShip.isDownKey = false;
            e.preventDefault();
        }
        // Left or A key
        if (keyID === 37 || keyID === 65) {
            playerShip.isLeftKey = false;
            e.preventDefault();
        }
        // Space
        if (keyID == 32) {
            playerShip.isSpacebar = false;
            e.preventDefault();
        }
    }
    
    function findPos(obj) {
        var curleft = 0;
        var curtop = 0;

        while( obj != null )
        {
            curleft += obj.offsetLeft ;
            curtop += obj.offsetTop ;
            obj = obj.offsetParent ;
        }

        return [curleft,curtop];
    }

    function mouseClicked(e) {
        
        var canvasPosition = findPos(canvasField);

        mouseX = e.pageX - canvasPosition[0];
        mouseY = e.pageY - canvasPosition[1];
        if (!isPlaying && !stopGame) {
            if (btnPlay.checkClicked()) {
                playGame();
            }
        }
        if (btnMusicOff.checkClicked()) {
            bgm.pause();
        } 
        if (btnMusicOn.checkClicked()) {
            bgm.play();
        } 
    }
    
    addEventHandler(window, "load", init, false);

})();