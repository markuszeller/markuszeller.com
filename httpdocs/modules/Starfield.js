"use strict";

export class Starfield {
    #scene;
    #stars     = [];
    #starCount = 2048;
    #tau       = Math.PI * 2;
    #alpha     = 0;

    constructor(scene) {
        this.#scene = scene;
        this.#createStars();
    }

    #createStars() {
        const cx        = this.#scene.canvas.width * .5;
        const cy        = this.#scene.canvas.height * .5;
        const angleStep = this.#tau / this.#starCount;
        for (let i = 0; i < this.#starCount; i++) {
            const a = angleStep * i;
            const b = Math.random() * 255;
            const n = b / 255 / 4;
            const s = n * 2;
            const r = n * 8;
            const d = Math.random() * cy;
            const x = cx + d * Math.cos(a);
            const y = cy + d * Math.sin(a);
            this.#stars.push({x, y, a, s, b, r});
        }
    }

    update() {
        const w     = this.#scene.canvas.width;
        const h     = this.#scene.canvas.height;
        const hw    = w * .5;
        const hh    = h * .5;
        this.#alpha = Math.min(this.#alpha + .003, 1);
        this.#stars.forEach(star => {
            star.x += Math.cos(star.a) * star.s;
            star.y += Math.sin(star.a) * star.s;
            if (star.x < -star.radius || star.x > star.r + w || star.y < -star.r || star.y > star.r + h) {
                star.x = hw;
                star.y = hh;
                star.a = Math.random() * this.#tau;
            }
        });
    }

    draw() {
        this.#stars.forEach(star => {
            this.#scene.ctx.fillStyle = `rgba(${star.b}, ${star.b}, ${star.b}, ${this.#alpha})`;
            this.#scene.ctx.beginPath();
            this.#scene.ctx.arc(star.x, star.y, star.r, 0, this.#tau);
            this.#scene.ctx.fill();
        });
    }
}
