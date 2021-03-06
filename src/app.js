"use strict";

/* Classes and Libraries */
const Game = require("./game");
const Vector = require("./vector");
const Camera = require("./camera");
const Player = require("./player");
const BulletPool = require("./bullet_pool");
const Map = require("./map.js");


/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var camera = new Camera(canvas);
var bullets = new BulletPool(30);
var missiles = [];
var player = new Player(bullets, missiles);
var map = new Map(canvas);

/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      event.preventDefault();
      input.up = true;
      break;

    case "ArrowDown":
    case "s":
      event.preventDefault();
      input.down = true;
      break;

    case "ArrowLeft":
    case "a":
      event.preventDefault();
      input.left = true;
      break;

    case "ArrowRight":
    case "d":
      event.preventDefault();
      input.right = true;
      break;

    case " ":
      event.preventDefault();
      player.shooting = true;
      break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function (event) {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      event.preventDefault();
      input.up = false;
      break;

    case "ArrowDown":
    case "s":
      event.preventDefault();
      input.down = false;
      break;

    case "ArrowLeft":
    case "a":
      event.preventDefault();
      input.left = false;
      break;

    case "ArrowRight":
    case "d":
      event.preventDefault();
      input.right = false;
      break;

    case " ":
      event.preventDefault();
      player.shooting = false;
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function (timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  map.update(elapsedTime);

  // update the player
  player.update(elapsedTime, input);

  // update the camera
  camera.update(player.position);

  // Update bullets
  bullets.update(elapsedTime, function (bullet) {
    if (!camera.onScreen(bullet)) return true;
    return false;
  });

  // Update missiles
  var markedForRemoval = [];
  missiles.forEach(function (missile, i) {
    missile.update(elapsedTime);
    if (Math.abs(missile.position.x - camera.x) > camera.width * 2)
      markedForRemoval.unshift(i);
  });
  // Remove missiles that have gone off-screen
  markedForRemoval.forEach(function (index) {
    missiles.splice(index, 1);
  });
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";

  // Transform the coordinate system using
  // the camera position BEFORE rendering
  // objects in the world - that way they
  // can be rendered in WORLD cooridnates
  // but appear in SCREEN coordinates
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  renderWorld(elapsedTime, ctx);
  ctx.restore();

  // Render the GUI without transforming the
  // coordinate system
  renderGUI(elapsedTime, ctx);
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx) {
  map.render(ctx);

  // Render the bullets
  bullets.render(elapsedTime, ctx);

  // Render the missiles
  missiles.forEach(function (missile) {
    missile.render(elapsedTime, ctx);
  });

  // Render the player
  player.render(elapsedTime, ctx);
}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI
}
