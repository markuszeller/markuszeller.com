"use strict";

export class Avatar {
    #spriteX    = 81;
    #spriteY    = 40;
    #width      = 512;
    #height     = 512;
    #dx         = 0;
    #dy         = 110;
    #lineY      = 0;
    #velocity   = 2.8;
    #scene;
    #isComplete = false;

    constructor(scene) {
        this.#scene = scene;
    }

    update() {
        this.#updateIn();
    }

    #updateIn() {
        if (this.isComplete() && !this.#scene.state.isAvatarIn()) {
            return;
        }
        this.#lineY += this.#velocity;
        if (this.#lineY > this.#height) {
            this.#isComplete = true;
        }
    }

    draw() {
        if (!this.isComplete()) {
            this.#drawIn();
            return;
        }
        this.#scene.ctx.drawImage(
            this.#scene.sprite,
            this.#spriteX, this.#spriteY, this.#width, this.#height,
            this.#dx, this.#dy, this.#width, this.#height
        );
    }

    isComplete() {
        return this.#isComplete;
    }

    #drawIn() {
        const top = this.#height - this.#lineY;
        this.#scene.ctx.drawImage(
            this.#scene.sprite,
            this.#spriteX, this.#spriteY + top, this.#width, this.#lineY,
            this.#dx, this.#dy + top, this.#width, this.#lineY
        );
        this.#scene.ctx.drawImage(
            this.#scene.sprite,
            this.#spriteX, this.#spriteY + top, this.#width, 1,
            this.#dx, this.#dy, this.#width, top
        );
    }
}
