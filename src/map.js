"use strict";

module.exports = exports = Map;

const back = new Image();
const midl = new Image();
const fore = new Image();

function Map() {
    back.src = encodeURI("assets/back.png");
}

Map.prototype.update = function (time) {

}

Map.prototype.render = function (ctx) {
    ctx.drawImage(back, 0, 0);
}