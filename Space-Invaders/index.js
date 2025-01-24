import audio from './audio.js'
import spaceshipImage from './images/spaceship.png'
import invaderImage from './images/invader.png'

let score = 0
const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

// Player
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.position = {
      x: canvas.width / 2,
      y: canvas.height - 50
    }
    this.speed = 5

    this.rotate = 0
    this.opacity = 1

    const image = new Image()
    image.src = spaceshipImage
    image.onload = () => {
      const scale = 0.12
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }

  draw() {
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.save()
    c.globalAlpha = this.opacity
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )

    c.rotate(this.rotate)

    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )

    c.restore()
  }

  move() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

class Projectiles {
  constructor(position, velocity) {
    this.position = position
    this.velocity = velocity

    this.radius = 4
    // this.color = "white";
    // this.width = 5;
    // this.height = 5;
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'red'
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.fades) this.opacity -= 0.01
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position || { x: 0, y: 0 }
    this.velocity = velocity

    this.width = 3
    this.height = 10
  }

  draw() {
    c.fillStyle = '#FF00FF'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = invaderImage
    this.position = {
      x: position.x,
      y: position.y
    }
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
    }
  }

  draw() {
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      )
    }
  }

  update({ velocity }) {
    if (this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }
shoot(invaderProjectiles) {
    // Ensure audio object is defined or remove this line if not necessary
    if (typeof audio !== 'undefined' && audio.enemyShoot) {
      audio.enemyShoot.play()
    }
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height
        },
        velocity: {
          x: 0,
          y: 5
        }
      })
    )
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 3,
      y: 0
    }

    this.invaders = []

    const columns = Math.floor(Math.random() * 10 + 5)
    const rows = Math.floor(Math.random() * 5 + 2)

    this.width = columns * 30
    this.height = rows * 30

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30
            }
          })
        )
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0 // every fram reset the y velocity to 0 and then add 30 the height of one invader

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x * 1.025
      this.velocity.y = 30
    }
  }
}

let player = new Player()
let projectiles = []
let invaders = new Invader({ position: { x: 0, y: 0 } }) // Removed unused variable
let grids = []
let invaderProjectiles = []
let particles = []

let key = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  space: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  },
  ArrowDown: {
    pressed: false
  }
}

function init() {
  player = new Player()
  projectiles = []
  invaders = []
  grids = []
  invaderProjectiles = []
  particles = []

  key = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
    w: {
      pressed: false
    },
    s: {
      pressed: false
    },
    space: {
      pressed: false
    },
    ArrowLeft: {
      pressed: false
    },
    ArrowRight: {
      pressed: false
    },
    ArrowUp: {
      pressed: false
    },
    ArrowDown: {
      pressed: false
    }
  }

  frames = 0
  randomInterval = Math.floor(Math.random() * 500) + 500

  game = {
    isOver: false,
    active: true
  }
  score = 0
  document.querySelector('#finalScore').innerHTML = score
  document.querySelector('#scoreEl').innerHTML = score

  // create stars
  for (let i = 0; i < 100; i++) {
    particles.push(
      new Particle({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height
        },
        velocity: {
          x: 0,
          y: Math.random() * 0.1 + 0.2
        },
        radius: Math.random() * 1.5,
        color: 'white'
      })
    )
  }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500) + 500

let game = {
  isOver: false,
  active: true
}

// create stars
for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
      },
      velocity: {
        x: 0,
        y: Math.random() * 0.1 + 0.2
      },
      radius: Math.random() * 1.5,
      color: 'white'
    })
  )
}
