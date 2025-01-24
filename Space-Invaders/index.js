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
  //

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

function rectangularCollision({ rectangle1, rectangle2 }) {
  if (!rectangle1 || !rectangle2) return false // Prevents errors
  return (
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function checkPlayerInvaderCollision() {
  // Check for collision between player and invaders
  grids.forEach((grid) => {
    grid.invaders.forEach((invader) => {
      if (game.isOver) return

      if (invader.position && invader.width && invader.height) {
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: invader
          })
        ) {
          setTimeout(() => {
            player.opacity = 0
            game.isOver = true
            endGame()

            // create explosion
            createExplosion({
              position: {
                x: player.position.x + player.width / 2,
                y: player.position.y + player.height / 2
              },
              color: 'white',
              particleCount: 15
            })
          }, 0)
          setTimeout(() => {
            game.active = false
          }, 2000)
        }
      }
    })
  })
}

function createExplosion({ position, color, particleCount }) {
  audio.explode.play()

  for (let i = 0; i < particleCount; i++) {
    particles.push(
      new Particle({
        position: {
          x: position.x,
          y: position.y
        },
        velocity: {
          x: (Math.random() - 0.5) * 1,
          y: (Math.random() - 0.5) * 1
        },
        radius: Math.random() * 3,
        color: color,
        fades: true
      })
    )
  }
}

function endGame() {
  console.log('you lose')
  audio.gameOver.play()

  // Makes player disappear
  setTimeout(() => {
    player.opacity = 0
    game.over = true
  }, 0)

  // stops game altogether
  setTimeout(() => {
    game.active = false
    document.querySelector('#restartScreen').style.display = 'flex'
    document.querySelector('#finalScore').innerHTML = score
  }, 2000)

  createExplosion({
    position: {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2
    },
    color: 'white',
    particleCount: 15
  })
}

function animation() {
  if (!game.active) return

  requestAnimationFrame(animation)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.move()

  particles.forEach((particle, particleIndex) => {
    if (particle.position.y - particle.radius > canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }

    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(particleIndex, 1)
      }, 0)
    } else {
      particle.update()
    }
  })

  particles.forEach((particle) => {
    particle.update()
  })

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (invaderProjectile.position.y > canvas.height) {
      invaderProjectiles.splice(index, 1)
    } else invaderProjectile.update()

    // remove player if invaders touch it
    checkPlayerInvaderCollision()
    if (
      rectangularCollision({
        rectangle1: invaderProjectile,
        rectangle2: player
      })
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)
        player.opacity = 0
        game.isOver = true
        endGame()

        // create explosion
        createExplosion({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y + player.height / 2
          },
          color: 'white',
          particleCount: 15
        })
      }, 0)
      setTimeout(() => {
        game.active = false
      }, 2000)
    }
  })

  grids.forEach((grid, gridIndex) => {
    grid.update()

    // spawn projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      )
    }

    grid.invaders.forEach((invader) => {
      invader.update({ velocity: grid.velocity })
    })

    // check for collision between projectiles and invaders
    projectiles.forEach((projectile, index) => {
      grid.invaders.forEach((invader, invaderIndex) => {
        if (
          // if our projectiles top position is less than the position of the invaders bottom position
          // there is a collision so we want to remove the projectile and the invader
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            )
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            )
            // Remove the invader and the projectile
            if (invaderFound && projectileFound) {
              score += 100
              scoreEl.innerHTML = score
              // create explosion
              createExplosion({
                position: {
                  x: invader.position.x + invader.width / 2,
                  y: invader.position.y + invader.height / 2
                },
                color: '#BAA0DE',
                particleCount: 15
              })
            }

            if (
              grid.invaders.includes(invader) &&
              projectiles.includes(projectile)
            ) {
              grid.invaders.splice(invaderIndex, 1)
              projectiles.splice(index, 1)
            }

            // update the width of the invaders grid to make sure we are not drawing the grid outside the canvas or bouncing before reaching the end of the window
            if (grid.invaders.length > 0) {
              const firstInvader = grid.invaders[0]
              const lastInvader = grid.invaders[grid.invaders.length - 1]

              grid.width =
                lastInvader.position.x -
                firstInvader.position.x +
                lastInvader.width
              grid.position.x = firstInvader.position.x
            } else {
              grids.splice(gridIndex, 1)
            }
          }, 0)
        }
      })
    })
  })

  projectiles.forEach((projectile, index) => {
    projectile.update()
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y + projectile.radius < 0 ||
      projectile.position.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })

  if ((key.ArrowLeft.pressed || key.a.pressed) && player.position.x > 0) {
    player.velocity.x = -player.speed
    player.rotate = -0.15
  } else if (
    (key.ArrowRight.pressed || key.d.pressed) &&
    player.position.x + player.width < canvas.width
  ) {
    player.velocity.x = player.speed
    player.rotate = 0.15
  } else {
    player.velocity.x = 0
    player.rotate = 0
  }

  if ((key.ArrowUp.pressed || key.w.pressed) && player.position.y > 5) {
    // we can set it to 0 but the tip of the spaceship will be cut off
    player.velocity.y = -player.speed
  } else if (
    (key.ArrowDown.pressed || key.s.pressed) &&
    player.position.y + player.height < canvas.height
  ) {
    player.velocity.y = player.speed
  } else {
    player.velocity.y = 0
  }

  // spawn enemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500) + 500
    frames = 0
  }

  frames++
}

document.addEventListener(
  'click',
  () => {
    const context = Howler.ctx
    if (context.state === 'suspended') {
      context.resume().then(() => {
        Howler.volume(1)
        audio.backgroundMusic.play()
      })
    }
  },
  { once: true }
)

document.querySelector('#startButton').addEventListener('click', () => {
  const context = Howler.ctx
  if (context.state === 'suspended') {
    context.resume().then(() => {
      try {
        audio.backgroundMusic.play()
      } catch (error) {
        console.error('Error playing background music:', error)
      }
      audio.start.play()
    })
  } else {
    audio.backgroundMusic.play()
    audio.start.play()
  }

  document.querySelector('#startScreen').style.display = 'none'
  document.querySelector('#scoreContainer').style.display = 'block'
  init()
  animation()
})

document.querySelector('#restartButton').addEventListener('click', () => {
  audio.select.play()
  document.querySelector('#restartScreen').style.display = 'none'
  init()
  animation()
})

addEventListener('keydown', ({ key: keyPressed }) => {
  if (game.isOver) return

  switch (keyPressed) {
    case 'a':
    case 'ArrowLeft':
      key.a.pressed = true
      key.ArrowLeft.pressed = true
      break
    case 'd':
    case 'ArrowRight':
      key.d.pressed = true
      key.ArrowRight.pressed = true
      break
    case 'w':
    case 'ArrowUp':
      key.w.pressed = true
      key.ArrowUp.pressed = true
      break
    case 's':
    case 'ArrowDown':
      key.s.pressed = true
      key.ArrowDown.pressed = true
      break

    case ' ':
      audio.shoot.play()

      projectiles.push(
        new Projectiles(
          {
            x: player.position.x + player.width / 2,
            y: player.position.y
          },
          {
            x: 0,
            y: -10
          }
        )
      )

      break
  }
})

addEventListener('keyup', ({ key: keyPressed }) => {
  if (game.isOver) return

  switch (keyPressed) {
    case 'a':
    case 'ArrowLeft':
      key.a.pressed = false
      key.ArrowLeft.pressed = false
      break
    case 'd':
    case 'ArrowRight':
      key.d.pressed = false
      key.ArrowRight.pressed = false
      break
    case 'w':
    case 'ArrowUp':
      key.w.pressed = false
      key.ArrowUp.pressed = false
      break
    case 's':
    case 'ArrowDown':
      key.s.pressed = false
      key.ArrowDown.pressed = false
      break
  }
})
