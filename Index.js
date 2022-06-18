const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7;
const velocity = 5 ;
class Sprite {
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150; 
        this.lastkey;
        this.AttackBox = {
            position: {
                x: this.position.x,
                y: this.position.y    
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }
    draw() {
        this.AttackBox.position.x = this.position.x + this.AttackBox.offset.x;
        this.AttackBox.position.y = this.position.y;
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        if (this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect( this.AttackBox.position.x, 
                        this.AttackBox.position.y, 
                        this.AttackBox.width, 
                        this.AttackBox.height);
        }
    }
    update() {

        this.draw()
        this.position.x += this.velocity.x; 
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }
    attack() {
        this.isAttacking = true;
        setTimeout(() =>{
            this.isAttacking = false;
        },100);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    }
});

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    color : 'blue',
    offset:{
        x: -50,
        y: 0
    }
});

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    } 
}

function rectangularCollision({rectangle1,rectangle2}){
    return(
        rectangle1.AttackBox.position.x +  rectangle1.AttackBox.width >=  rectangle2.position.x  &&
        rectangle1.AttackBox.position.x <= rectangle2.position.x +        rectangle2.width       &&
        rectangle1.AttackBox.position.y +  rectangle1.AttackBox.height >= rectangle2.position.y  &&
        rectangle1.AttackBox.position.y <= rectangle2.position.y +        rectangle2.height      &&
        rectangle1.isAttacking
    );
}

function determineWinner({player, enemy, timerId}){   
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex'; 
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if(player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else if(player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer>0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId});
    }
}
decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height);
    player.update();
    enemy.update();

    //Player movement
    player.velocity.x = 0;
    if(keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -velocity;
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = velocity;
    }

    //Enemy Movement
    enemy.velocity.x = 0;
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -velocity;
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = velocity;
    }

    //detect for colition  
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
        }) && 
        player.isAttacking
        ) 
        {   
            enemy.health -= 20;                            
            document.querySelector('#enemyHealth').style.width = enemy.health +'%';
            player.isAttacking = false;
            console.log('Player is Attacking');
        }
    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
        }) && 
        enemy.isAttacking
        ) 
        {   
            player.health -= 20;                            
            document.querySelector('#playerHealth').style.width = player.health +'%';
            enemy.isAttacking = false;
            console.log('Enemy is Attacking');
        }
    
    // End game by health    
    if (player.health === 0 || enemy.health === 0 ){
        determineWinner({player, enemy, timerId});   
    }    
}
animate();

window.addEventListener('keydown',(event)=>{
    let jump = 20;
    
    switch(event.key){
        
        //player
        case 'd':
        case 'D':    
            keys.d.pressed = true;
            player.lastkey = 'd'
            break
        case 'a':
        case 'A':    
            keys.a.pressed = true;
            player.lastkey = 'a'
            break
        case 'w':
        case 'W':
            player.velocity.y += -jump;
            break
        case ' ':
            player.attack();
            break

        //Enemy    
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y += -jump;
            break    
        case 'ArrowDown':
            enemy.attack();
            break    
    }
    
})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
        case 'D':
            keys.d.pressed = false;
            break
        case 'a':
        case 'A':
            keys.a.pressed = false;
            break
        case 'w':
        case 'W':
            keys.w.pressed = false;
            player.lastkey = 'w'
            break
        
        //Enemy    
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            enemy.lastkey = 'w'
            break    
    }
    //console.log(event.key);
})