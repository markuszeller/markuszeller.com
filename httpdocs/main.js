"use strict";
import {Font} from "./modules/Font.js";
import {StateMachine} from "./modules/StateMachine.js";
import {Avatar} from "./modules/Avatar.js";
import {Starfield} from "./modules/Starfield.js";

const canvas = document.getElementById("canvas");
const sprite = new Image();

const scene = {
    canvas   : canvas,
    ctx      : canvas.getContext("2d"),
    fps      : 60,
    frameRate: 1000 / 60,
    state    : new StateMachine(),
    sprite   : sprite
};

sprite.addEventListener("load", () => scene.state.setAvatarIn());
sprite.src = "/sprite.png";

const starfield = new Starfield(scene);
const font      = new Font(
    scene,
    [...document.querySelectorAll('#scrolltext li')].map(e => e.innerText).join(' --- ')
);
const avatar    = new Avatar(scene);

document.querySelectorAll('footer dl').forEach(dl => {
    font.addContainer([...dl.querySelectorAll('dd')].map(dd => dd.innerText));
});

const update = () => {
    starfield.update();
    avatar.update();

    if ((scene.state.isAvatarIn() && avatar.isComplete()) || scene.state.isReady()) {
        font.nextContainer();
    }

    if (avatar.isComplete()) {
        font.update();
    }
}
const draw   = () => {
    scene.ctx.clearRect(0, 0, canvas.width, canvas.height);
    starfield.draw();
    avatar.draw();
    font.draw();
}

let lastTime = 0;
const loop   = (time) => {
    const deltaTime = time - lastTime;
    if (scene.state.isInit() || deltaTime < scene.frameRate) {
        requestAnimationFrame(loop);
        return;
    }
    update();
    draw();
    lastTime = time;
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
