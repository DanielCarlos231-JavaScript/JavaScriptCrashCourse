const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7;
const velocity = 5 ;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 152
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    frameMax: 6
})

const player = new Fighter({
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
    },
    imageSrc: './img/Martial Hero/idle.png',
    scale: 2.75,
    frameMax: 8,
    offset: {
        x: 250,
        y: 182
    },
    sprites: {
        idle: {
            imageSrc: './img/Martial Hero/Idle.png',
            frameMax: 8
        },
        run: {
            imageSrc: './img/Martial Hero/run.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './img/Martial Hero/jump.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './img/Martial Hero/fall.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './img/Martial Hero/attack1.png',
            frameMax: 6
        },
        takeHit: {
            imageSrc: './img/Martial Hero/Take hit.png',
            frameMax: 4
        },
        death: {
            imageSrc: './img/Martial Hero/Death.png',
            frameMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 0,
            y: 30
        },
        width: 268,
        height: 50    
    }
});

const enemy = new Fighter ({
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
    },
    imageSrc: './img/Martial Hero2/idle2.png',
    scale: 2.75,
    frameMax: 4,
    offset: {
        x: 225,
        y: 200
    },
    sprites: {
        idle: {
            imageSrc: './img/Martial Hero2/Idle2.png',
            frameMax: 4
        },
        run: {
            imageSrc: './img/Martial Hero2/run2.png',
            frameMax: 8
        },
        jump: {
            imageSrc: './img/Martial Hero2/jump2.png',
            frameMax: 2
        },
        fall: {
            imageSrc: './img/Martial Hero2/fall2.png',
            frameMax: 2
        },
        attack1: {
            imageSrc: './img/Martial Hero2/attack12.png',
            frameMax: 4
        },
        takeHit: {
            imageSrc: './img/Martial Hero2/Take hit2.png',
            frameMax: 3
        },
        death: {
            imageSrc: './img/Martial Hero2/Death2.png',
            frameMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -168,
            y: 42
        },
        width: 218,
        height: 50    
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

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height);
    background.update();
    shop.update();

    //Contrast
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0,0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    //Player movement
    player.velocity.x = 0;
    if(keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -velocity;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = velocity;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    //Enemy Movement
    enemy.velocity.x = 0;
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -velocity;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = velocity;
        enemy.switchSprite('run');
    }else {
        enemy.switchSprite('idle');
    }
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //detect for colition  
    if(rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
        }) && 
        player.isAttacking &&
        player.framesCurrent === 4
        ) 
        {   
            enemy.takeHit();                          
            // document.querySelector('#enemyHealth').style.width = enemy.health +'%';
            
            gsap.to('#enemyHealth', {
                width: enemy.health +'%' 
            })

            player.isAttacking = false;
            console.log('Player is Attacking');
        }
    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }
        

    if(rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
        }) && 
        enemy.isAttacking &&
        enemy.framesCurrent === 2
        ) 
        {   

            player.takeHit();                           
            // document.querySelector('#playerHealth').style.width = player.health +'%';
            
            gsap.to('#playerHealth', {
                width: player.health +'%' 
            })
            
            enemy.isAttacking = false;
            console.log('Enemy is Attacking');
        }
    
    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }
        
    // End game by health    
    if (player.health === 0 || enemy.health === 0 ){
        determineWinner({player, enemy, timerId});   
    }    
}
animate();

window.addEventListener('keydown',(event)=>{
    let jump = 20;
    
    if (!player.dead) {
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
    
        }
    }

    if (!enemy.dead) {
        //Enemy
        switch(event.key){        
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