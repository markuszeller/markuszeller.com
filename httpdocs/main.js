"use strict";
import {Font} from "./modules/Font.js";
import {StateMachine} from "./modules/StateMachine.js";
import {Avatar} from "./modules/Avatar.js";

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

const font = new Font(scene);
const avatar = new Avatar(scene);

document.querySelectorAll('footer dl').forEach(dl => {
    font.addContainer([...dl.querySelectorAll('dd')].map(dd => dd.innerText));
});

const update = () => {
    avatar.update();

    if ((scene.state.isAvatarIn() && avatar.isComplete()) || scene.state.isReady()) {
        font.nextContainer();
    }

    font.update();
}
const draw   = () => {
    scene.ctx.clearRect(0, 0, canvas.width, canvas.height);
    avatar.draw();
    font.drawContainer();
    font.drawPortal();
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
