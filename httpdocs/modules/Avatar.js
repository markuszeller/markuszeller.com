"use strict";

export class Avatar {
    #spriteX      = 81;
    #spriteY      = 40;
    #width        = 512;
    #height       = 512;
    #dx           = 0;
    #dy           = 110;
    #lineY        = 0;
    #velocity     = 2.8;
    #scene;
    #isComplete   = false;
    #isWobbling   = false;
    #wobbleScale  = .1;
    #wobbleMax    = 32;
    #wobbleEffect = 0;
    #wobbleHeight = 16;

    constructor(scene) {
        this.#scene = scene;
    }

    update() {
        this.#updateIn();
        this.#updateEffect();
    }

    #updateIn() {
        if (this.isComplete() && !this.#scene.state.isAvatarIn()) {
            return;
        }
        this.#lineY += this.#velocity;
        if (this.#lineY > this.#height) {
            this.#isComplete = true;
            this.#isWobbling = true;
        }
    }

    #updateEffect() {
        if (!this.#isWobbling) {
            return;
        }

        switch (this.#wobbleEffect) {
            case 0:
                this.#wobbleScale *= 1.01;
                if (this.#wobbleScale > this.#wobbleMax) {
                    this.#wobbleEffect++;
                    this.#wobbleScale = -this.#wobbleMax - 2;
                }
                break;
            case 1:
                this.#wobbleScale *= .99;
                if (this.#wobbleScale > -.1) {
                    this.#resetEffect();
                }
                break;
        }
    }

    #resetEffect() {
        this.#wobbleScale  = .1;
        this.#wobbleEffect = 0;
    }

    draw() {
        if (!this.isComplete()) {
            this.#drawIn();
            return;
        }

        if (this.#isWobbling) {
            this.#drawWobble();
            return;
        }

        this.#drawStatic();
    }

    #drawStatic() {
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

    #drawWobble() {
        for (let y = 0; y < this.#height; y += this.#wobbleHeight) {
            const x = Math.sin(this.#wobbleScale + y * .01) * Math.min(this.#wobbleScale, this.#wobbleMax);
            this.#scene.ctx.drawImage(
                this.#scene.sprite,
                this.#spriteX, this.#spriteY + y, this.#width, this.#wobbleHeight,
                this.#dx + x, this.#dy + y, this.#width, this.#wobbleHeight
            );
        }
    }
}
