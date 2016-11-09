"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Missile = require('./missile');

/* Constants */
const SPRITE_SCALE = 0.67; 
const PLAYER_SPEED = 5;
const BULLET_SPEED = 10;
const WEAPON_COOLDOWN = 200;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player(bullets, missiles) {
  this.missiles = missiles;
  this.missileCount = 4;
  this.bullets = bullets;
  this.angle = 0;
  this.position = { x: 200, y: 200 };
  this.velocity = { x: 0, y: 0 };
  this.img = new Image()
  this.img.src = 'assets/spaceArt/png/player.png';
  this.img.w = 99 * SPRITE_SCALE;
  this.img.h = 75 * SPRITE_SCALE;
  this.shooting = false;

  this.timers = {
    weapon: 0
  }
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function (elapsedTime, input) {
  this.timers.weapon += elapsedTime;

  // set the velocity
  this.velocity.x = 0;
  if (input.left) this.velocity.x -= PLAYER_SPEED;
  if (input.right) this.velocity.x += PLAYER_SPEED;
  this.velocity.y = 0;
  if (input.up) this.velocity.y -= PLAYER_SPEED - 2;
  if (input.down) this.velocity.y += PLAYER_SPEED - 2;

  // determine player angle
  this.angle = 0;
  if (this.velocity.x < 0) this.angle = -1;
  if (this.velocity.x > 0) this.angle = 1;

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // don't let the player move off-screen
  if (this.position.x < 0) this.position.x = 0;
  if (this.position.x > 1024) this.position.x = 1024;
  if (this.position.y > 786) this.position.y = 786;

  if (this.shooting && this.timers.weapon >= WEAPON_COOLDOWN) {
    this.fireBullet({ x: 0, y: -1 });
    this.timers.weapon = 0;
  }
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function (elapasedTime, ctx) {
  var offset = this.angle * 23;
  ctx.fillStyle = "pink";
  ctx.fillRect(this.position.x, this.position.y, 1, 1);
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, -this.img.w/2, -this.img.h/2, this.img.w, this.img.h);
  ctx.restore();
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Player.prototype.fireBullet = function (direction) {
  // var position = Vector.add(this.position, { x: 30, y: 30 });
  var velocity = Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(this.position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */
Player.prototype.fireMissile = function () {
  if (this.missileCount > 0) {
    // var position = Vector.add(this.position, { x: 0, y: 30 })
    var missile = new Missile(this.position);
    this.missiles.push(missile);
    this.missileCount--;
  }
}
