import {Speaker} from "/js/modules/speaker.js";

export class Homepage {
    constructor(build) {
        this.build = build;

        this.initMouse();
        this.initScreen();
        this.initCanvas();


        this.frame = 0;
        this.fps = 60 / 1000;
        this.timeElapsed = 0;

        this.sprite = new Image();
        this.addSpriteEventListeners();

        this.audio = document.getElementById('audio');

        this.speaker = new Speaker(this);
    }

    initMouse() {
        this.touched = false;
        this.clicked = false;

        this.mx = -1;
        this.ox = -1;
        this.my = -1;
        this.oy = -1;
    }

    initScreen() {
        this.w = document.documentElement.clientWidth;
        this.h = document.documentElement.clientHeight;
        this.y = this.h * .5;
        this.yh = this.y * .5;
        this.ow = this.w;
        this.oh = this.h;
    }

    createCanvas() {
        const canvas = document.body.appendChild(document.createElement("canvas"));
        canvas.width = this.w;
        canvas.height = this.h;
        canvas.style.position = "fixed";
        canvas.style.top = '0';
        canvas.style.left = '0';

        return canvas;
    }

    addCanvasEventlisteners() {
        this.canvas.addEventListener("mousemove", this.mouseHandler);

        const me = this;
        this.canvas.addEventListener("touchend", function (e) {
            me.mouseHandler(e.changedTouches[0]);
            me.touched = true;
            me.clearTouch();
        });

        this.canvas.addEventListener("click", function () {
            me.clicked = true;
            me.clearTouch();
        });
    }

    mouseHandler(e) {
        this.mx = e.clientX;
        if (this.ox === -1) this.ox = this.mx;
        this.my = e.clientY;
        if (this.oy === -1) this.oy = this.my;
    }

    clearTouch() {
        const me = this;
        setTimeout(function () {
            me.touched = me.clicked = false;
        }, 200);
    }

    addSpriteEventListeners() {
        const me = this;
        this.sprite.addEventListener('load', function () {
            window.requestAnimationFrame(me.animate.bind(me));
        });
    }

    animate(t) {
        if (t - this.timeElapsed >= this.fps) {
            this.update();
            this.draw();
            this.timeElapsed = t;
            this.frame++;
        }

        window.requestAnimationFrame(this.animate.bind(this));
    }

    updateMouse() {
        this.dx = this.ox - this.mx;
        this.dy = this.oy - this.my;
        this.ox = this.mx;
        this.oy = this.my;
    }

    update() {
        this.updateMouse();

        /*
        stars.forEach(function (star) {
            star.update();
        });

        sin += .002 * sinDir;
        if (sin > 1 || sin < -1) sinDir *= -1;
        pages[page].update();
        /*
        runner.update();
        /*
        profiles.forEach(function (p) {
            p.update()
        });
        ship.update();
        if (!barVisible) bars.forEach(function (b) {
            b.visible = true;
            barVisible++
        });
        bars.forEach(function (b) {
            b.update();
        });

         */

        this.speaker.update();
    }

    draw() {
        this.ctx.fillStyle = "#000";
        this.ctx.clearRect(0, 0, this.w, this.h);

        /*
        let c, fx, i, x, xoffs, yoffs;

        stars.forEach(function (star) {
            star.draw();
        });

        bars.forEach(function (b) {
            b.draw();
        });

        let bsFrame = frame * bigScrollerSpeed;
        xoffs = w - bsFrame;
        for (i = 0; i < text.length; i++) {
            yoffs = y + Math.cos((frame / bigScrollerSpeed) * .04 + i * .1) * Math.sin(sin) * yh - hfs;
            c = text[i];
            fx = chars.indexOf(c);
            if (fx === -1) fx = 0;
            x = xoffs + i * fs;
            if (x > -fs && x < w) {
                this.ctx.drawImage(sprite, fx * fs, sFontY, fs, fs, x, yoffs, fs, fs);
                if (c === ctrlEsc) frame = 0;
            }
        }
        runner.draw();
        pages[page].draw();
        profiles.forEach(function (p) {
            p.draw()
        });
        ship.draw();


         */
        this.speaker.draw();
    }

    initCanvas() {
        this.canvas = this.createCanvas();
        this.addCanvasEventlisteners();
        this.ctx = this.canvas.getContext("2d");
    }

    run() {
        this.sprite.src = 'img/sprite.png?v=' + this.build;
    }
}
