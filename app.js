
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