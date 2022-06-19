class Sprite {
    constructor({position, imageSrc, scale = 1, frameMax = 1, offset = {x: 0, y: 0}}) {
        this.position = position;
        this.width = 50;
        this.height = 150; 
        this.image = new Image;
        this.image.src = imageSrc;
        this.scale = scale;
        this.frameMax = frameMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
    }
    draw() {
        c.drawImage(this.image,
                    this.framesCurrent * (this.image.width/this.frameMax),
                    0,
                    this.image.width/this.frameMax,
                    this.image.height,
                    this.position.x - this.offset.x,
                    this.position.y - this.offset.y,
                    (this.image.width/this.frameMax)*this.scale,
                    this.image.height*this.scale);
    }

    animateFrames(){
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent<this.frameMax -1){
                    this.framesCurrent++
                }else{
                    this.framesCurrent = 0
                }
        }
    } 

    update() {
        this.draw()
        this.animateFrames();
    }
    
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
       // offset,
        imageSrc, 
        scale = 1, 
        frameMax = 1,
        offset = {x: 0, y: 0},
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
        }) {
        super({
            position,
            imageSrc,
            scale,
            frameMax,
            offset
        })    
    //    this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150; 
        this.lastkey;
        this.AttackBox = {
            position: {
                x: this.position.x,
                y: this.position.y    
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.ground = 72;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
        //console.log(this.sprites)
    }
    /*
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
    */
    update() {

        this.draw();
        
        if(!this.dead) this.animateFrames();
        
        this.AttackBox.position.x = this.position.x + this.AttackBox.offset.x;
        this.AttackBox.position.y = this.position.y + this.AttackBox.offset.y;
        
        /*
        // Show attack field
        c.fillRect( this.AttackBox.position.x,
                    this.AttackBox.position.y,
                    this.AttackBox.width,
                    this.AttackBox.height)
        
        
        // Show player/enemy field            
        c.fillRect( this.position.x,
            this.position.y,
            this.width,
            this.height)
        */           
        
        this.position.x += this.velocity.x; 
        this.position.y += this.velocity.y;

        //gravity
        if(this.position.y + this.height + this.velocity.y >= canvas.height - this.ground) {
            this.velocity.y = 0;
            this.position.y = 354;
        } else this.velocity.y += gravity;
        // console.log(this.position.y);
    }
    attack() {
        this.switchSprite('attack1');    
        this.isAttacking = true;
        /*
        setTimeout(() =>{
            this.isAttacking = false;
        },100);
        */
    }

    takeHit() {
        this.health -= 20; 
        if (this.health <= 0) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit'); 
        }
        
    }
    switchSprite(sprite) {
        // Overwrites all other animations to attack1
        if (this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.frameMax - 1) {    
            return;
        }
        // Overwrites all other animations to takeHit
        if (this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.frameMax - 1) {
            return;
        }
        // Overwrites all other animations to death
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.frameMax - 1)
                this.dead = true;
            return;
        }

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.frameMax = this.sprites.idle.frameMax;
                    this.framesCurrent = 0;
                }
                break; 
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.frameMax = this.sprites.takeHit.frameMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.frameMax = this.sprites.run.frameMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.frameMax = this.sprites.jump.frameMax;
                    this.framesCurrent = 0;
                }
                break;    
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.frameMax = this.sprites.fall.frameMax;
                    this.framesCurrent = 0;
                }
                break;    
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.frameMax = this.sprites.attack1.frameMax;
                    this.framesCurrent = 0;
                }
                break;    
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.frameMax = this.sprites.death.frameMax;
                    this.framesCurrent = 0;
                }
                break;    

            default:
                break;
        }
    }    
}