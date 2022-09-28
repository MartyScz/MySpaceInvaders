
const world = document.querySelector('#gameBoard')
const context = world.getContext('2d')

world.width = world.clientWidth
world.height = world.clientHeight

let frames = 0
const missiles = []

const keys = {
    ArrowLeft: { pressed:false},
    ArrowRight: { pressed:false},
}

class Player {
    constructor(){
        this.width = 32 //Largeur du player
        this.height = 32 // Hauteur du player
        this.velocity = {
            x:0, // Vitesse de déplacement sur l'axe des x
            y:0,  // Vitesse de déplacement sur l'axe des y 
        }

        const image = new Image()
        image.src = './Images/spaceSheep.png'
        image.onload = () => {
            this.image = image
            this.width = 35
            this.height = 35
            this.position= {
                x: world.width/2 - this.width/2,
                y: world.height - this.height -10
            }
        }
    }


    draw() {
    // Le joueur sera un carré blanc
        context.drawImage(this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
            
            );
    }

    shoot() {
        missiles.push(new Missile({
            position: {
                x: this.position.x + this.width/2,
                y: this.position.y
            },
        }))
    }



    update() {
    // A chaque mise à jour on dessine le joueur
    if(this.image) {
        if(keys.ArrowLeft.pressed && this.position.x >= 0){ // empêche de sortir de l'écran a gauche
            this.velocity.x = -5
        }
        else if(keys.ArrowRight.pressed && this.position.x <= world.width - this.width){ // empêche de sortir de l'écran a droite
            this.velocity.x = 5
        }
        else {this.velocity.x = 0}

    this.position.x += this.velocity.x
    this.draw()
        }
    }
}

//Creation des Aliens
class ALien {
    constructor({position}) {
        this.velocity = {x0, y:0}
        const image = new Image()
        image.src = './Images/greenAlien.png'
        image.onload = () => {
            this.image = image
            this.width = 32
            this.height = 32
            this.position = {
                x:position.x,
                y:position.y
            }
        }
    }

    draw() {
        if (this.image) {
            context.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        }
    }

    update({velocity}) {
        if (this.image) {
            this.position.x += velocity.x
            this.position.y += velocity.y
            if (this.position.y + this.height >= world.height) {
                console.log('You Loose')
            }
        }
        this.draw()
    }
    // Missiles que les aliens tirent
    shoot(alienMissiles) {
        if (this.position) {
            alienMissiles.push(new alienMissile ({
                    position: {
                    x:this.position.x,
                    y:this.position.y
                },
                velocity: {
                    x: 0,
                    y: 3
                }
            }))
        }
    }
}

class Missile {
    constructor({position}) {
        this.position = position
        this.velocity ={x:0, y:-5}
        this.width = 3
        this.height = 10
    }
    draw() {
        context.fillStyle = 'red'
        context.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
    update() {
        this.position.y += this.velocity.y
        this.draw()
    }
}

class Grid {
    constructor() {
        this.position = {x: 0, y: 0}
        this.velocity = {x: 0.5, y: 0}
        this.invaders = [ ]
        let rows = Math.floor((world.height/34)*(1/3))
        const columns = Math.floor((world.width/34)*(2/3))
        this.height = rows*34
        this.width = columns*34
        for (let x = 0; x < columns; x++){
            for (let y = 0; y < rows; y ++) {
                this.invaders.push(new ALien({
                    position: {
                        x: x * 34,
                        y: y * 34
                    }
                }))
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if(this.position.x + this.width >= world.width || this.position.x == 0) {
            this.velocity.x = - this.velocity.x
            this.velocity.y = 32
        }
    }
}

const player = new Player()


// Boucle d'animation

const animationLoop = () => {
    requestAnimationFrame(animationLoop)
    context.clearRect(0,0,world.width,world.height)
    player.update()
    missiles.forEach((missile,index) => {
        if(missile.position.y + missile.height <= 0) {
            setTimeout(() => {
                missiles.splice(index,1)}
                ,0)}
        else{missile.update()}
            })
    frames++
    
}
animationLoop()


addEventListener("keydown",({key}) => {

    switch(key){
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            console.log('gauche')
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            console.log('droite')
            break
    }
})

addEventListener("keyup",({key}) => {
    switch(key){
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            console.log('gauche')
            break
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                console.log('droite')
            break
        case ' ':
            player.shoot()
            console.log(missiles)    
    }

})