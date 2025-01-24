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