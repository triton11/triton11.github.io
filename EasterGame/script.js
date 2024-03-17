let score = 0;
let scoreText;
let currentEgg = ['egg', 100, 10];
let frozen = false;
let backwards = 1;
let lucky = false;
let invisible = false;

const eggTypes = [
  ['egg', 100, 10],
  ['spicy', 250, 30],
  ['freezy', 200, 0],
  ['sideways', 200, 20],
]

const config = {
  type: Phaser.AUTO,
  width: 300,
  height: 400,
  backgroundColor: '#f9f9f9',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'assets/repl.png');
  this.load.image('egg', 'assets/easter_egg.png');
  this.load.image('freezy', 'assets/easter_egg_freezy.png');
  this.load.image('loopy', 'assets/easter_egg_loopy.png');
  this.load.image('spicy', 'assets/easter_egg_spicy.png');
  this.load.image('sideways', 'assets/easter_egg_sideways.png');

}

function create() {
  this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
  this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

  this.egg = this.physics.add.image(config.width / 2, 0, 'egg').setScale(0.25, 0.25);
  this.egg.setVelocityY(100);

  this.player = this.physics.add.image(config.width / 2, config.height / 4 * 3, 'player').setScale(0.25, 0.25);
  this.player.setCollideWorldBounds(true);

  //  Create the answer text "corks"
  scoreText = this.add.text(16, 30, 'Score: ', { fontSize: '20px', fill: '#000' })
  const highScoreText = this.add.text(16, 6, 'High Score: 400', { fontSize: '20px', fill: '#000' })
}

function update() {
  //  Solution is corks
  if (score > 400) {
    alert("You've beaten my high score! The Oracle's favorite food is clams!")
    score = "clams"
  }
  this.physics.overlap(this.player, this.egg, collectEgg, null, this);
  let cursors = this.input.keyboard.createCursorKeys();
  var pointer = this.input.activePointer;
  if (((cursors.left.isDown || this.a.isDown) || (cursors.right.isDown || this.d.isDown) || (pointer.isDown)) && frozen === false) this.player.setVelocityX((cursors.left.isDown || this.a.isDown || pointer.x < config.width / 2) ? -160 : 160);
  else this.player.setVelocityX(0);

  // invisible
  if (this.egg.y > 100 && invisible === true) {
    this.egg.setVisible(false);
  }
  
  // loopy
  if (this.egg.y > 200 && this.egg.y < 230 && currentEgg[0] === 'loopy') {
    if (this.egg.x > config.width / 2) {
      this.egg.setVelocityX(-150);
    } else {
      this.egg.setVelocityX(150);
    }
  }

  // sideways
  if (((cursors.left.isDown || this.a.isDown) || (cursors.right.isDown || this.d.isDown) || (pointer.isDown)) && currentEgg[0] === 'sideways') this.egg.setVelocityX(cursors.left.isDown || this.a.isDown || pointer.x < config.width / 2 ? 200 : -200);

  // Create the solution text "corks"
  if (this.egg.y > config.height) {
    if (backwards === 1) {
      score -= currentEgg[2];
    }
    if (score < 0) {
      score = 0
    }
    scoreText.text = 'Score: ' + score
    //freezy reset
    frozen = false;
    resetEgg(this.egg);
  }
}

function collectEgg(player, egg) {
  //freezy
  if (currentEgg[0] === 'freezy') {
    frozen = true;
  }
  
  //  Update the score
  score += currentEgg[2] * backwards;
  if (score < 0) {
    score = 0
  }
  scoreText.text = 'Score: ' + score
  // Removes the egg from the screen
  resetEgg(egg);
}

function resetEgg(egg) {
  invisible = false;
  backwards = 1;
  egg.setRotation(0);
  egg.setVelocityX(0);
  egg.setVisible(true);
  currentEgg = eggTypes[getRandomInt(eggTypes.length)];
  egg.setTexture(currentEgg[0])
  egg.setRandomPosition(0, 0, config.width, 0);
  if (getRandomInt(100) > 80) {
    invisible = true;
  }
  if (getRandomInt(100) > 66) {
    backwards = -2;
    egg.setRotation(Math.PI);
  }
  egg.setVelocityY(currentEgg[1]);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}