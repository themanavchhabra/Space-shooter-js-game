var GamePiece;
var pellet = [];
var EnemyGamePiece = [];
var PowerUp = [];
var hit = 0;
var score = 0;
var powerup = "none";
let f = 0;
PowerUpTypes = ["doubleshooter", "fastshooter"];



function StartGame(){
    GamePiece = new component(30,30,"red",300,400,"notimg")
    GameWallLower = new component(960, 1, "white", 0, 540, "notimg");
    GameWallUpper = new component(960, 1, "white", 0, 0, "notimg")
    GameArea.start()
}

var GameArea = {
    canvas : document.createElement("canvas"),
    start : function (){
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d")
        this.frameNo = 0;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function(e){
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function(e) {
            GameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    },
}

function EveryInterval(num){
    if ((GameArea.frameNo / num) % 1 == 0) {return true;}
    return false;
}

function component(width, height, color, x, y, type){
    this.type = type;
    if (type == "image"){
        this.image = new Image()
        this.image.src = color
    }
    this.gamearea = GameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = GameArea.context;
        if (type == "image"){
            ctx.drawImage(this.image,
                this.x, 
                this.y, 
                this.width, 
                this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.NewPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.CrashWith = function(EnemyObj){
        if (this.x < EnemyObj.x + EnemyObj.width &&
            this.x + this.width > EnemyObj.x &&
            this.y < EnemyObj.y + EnemyObj.height &&
            this.y + this.height > EnemyObj.y ){
                crash = true;        
        } else {
            crash = false;
        }
        return crash
    }
}

function shoot(x,y){
    // f += 1;
    xreg = x+10      // updating 'x' to get it on the middle of the gamepiece
    x1 = x           //updatinng x to get it on the left edge of the gamepiece
    x2 = x+30        //updating X to get it on the right edge of the gamepiece

    if(powerup == "none"){
        pellet.push(new component(10, 10, "black", xreg, y, "notimg"))
    }
    else if(powerup == "doubleshooter"){
        pellet.push(new component(10,10,"black",x1,y,"notimg"))
        pellet.push(new component(10,10,"black",x2,y,"notimg"))
    }     
    else if(powerup == "fastshooter"){
        pellet.push(new component(10, 10, "black", xreg, y, "notimg"))
    }   
}

function updateGameArea(){
    for(var i =0; i<EnemyGamePiece.length;i++){
        if(GamePiece.CrashWith(EnemyGamePiece[i])){
            z = 1
            GameArea.stop();
            return;
        }
    }
    for(var i = 0; i<EnemyGamePiece.length;i++){
        for(j=0; j<pellet.length; j++){
            if(pellet[j].CrashWith(EnemyGamePiece[i])){
                EnemyGamePiece.splice(i,1);
                score += 1;
                document.getElementById("score").innerHTML = score;
                // EnemyGamePiece.update();
                return;
            }
        }
    }
    for(var i =0; i<EnemyGamePiece.length;i++){
        if (EnemyGamePiece[i].CrashWith(GameWallLower)){
            EnemyGamePiece.splice(i,1);
            if(powerup != "none"){
                powerup = "none";
            }
            else{
                hit += 1;
            }
            document.getElementById("hits").innerHTML = hit;
            if(hit == 3){
                GameArea.stop()
            }
        }
    }
    for(var i = 0; i<pellet.length;i++){
        if(pellet[i].CrashWith(GameWallUpper)){
            pellet.splice(i,1)
        }
    }
    for (var i = 0; i<PowerUp.length;i++){
        if(GamePiece.CrashWith(PowerUp[i])){
            if(PowerUp[i].type == "doubleshooter"){
                powerup = "doubleshooter"
            }
            if(PowerUp[i].type == "fastshooter"){
                powerup = "fastshooter";
            }        
            PowerUp.splice(i,1);
        }
    }
   
    GameArea.clear()
    GameWallUpper.update()
    GameWallLower.update()
    GamePiece.speedX = 0;
    GamePiece.speedY = 0;
    GameArea.frameNo += 1;

    if(GameArea.frameNo == 1 || EveryInterval(100)){
        minX = 0;
        maxX = 930;
        randomX = Math.floor(Math.random()*(maxX-minX+1)-minX)
        EnemyGamePiece.push(new component(20,20,"blue",randomX,10,"notimg"))
    }
    if(EveryInterval(800)){
        poweruptype = PowerUpTypes[Math.floor(Math.random()*PowerUpTypes.length)]
        if(poweruptype == "doubleshooter"){
            PowerUp.push(new component(20,20,"green",randomX,10,"doubleshooter"))
        }
        else if(poweruptype == "fastshooter"){
            PowerUp.push(new component(20,20,"purple",randomX,10,"fastshooter"))
        }
    }
    if (powerup != "fastshooter"){
         n = 15;
    }
    else {
        n = 1;
    }

    if(EveryInterval(n)){
        shoot(GamePiece.x, GamePiece.y)
    }
    for(var i = 0; i<EnemyGamePiece.length;i++){
        EnemyGamePiece[i].y += 3;
        EnemyGamePiece[i].update()
    }
    
    if (GameArea.keys && GameArea.keys[39]) {
        GamePiece.speedX = +6;
    }
    if (GameArea.keys && GameArea.keys[37]) {
        GamePiece.speedX = -6;
    } 
    if (GameArea.keys && GameArea.keys[32]){
        shoot(GamePiece.x, GamePiece.y)
    }
    GamePiece.NewPos();
    GamePiece.update();
    for (var i =0;i<pellet.length;i++){
        pellet[i].y -= 6
        pellet[i].update()
    }
    for(var i=0;i<PowerUp.length;i++){
        PowerUp[i].y += 2;
        PowerUp[i].update()
    }
    
}