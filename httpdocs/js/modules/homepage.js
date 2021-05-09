import {Speaker} from "/js/modules/speaker.js";
import {Profile} from "/js/modules/profile.js";
import {Runner} from "/js/modules/runner.js";
import {Star} from "/js/modules/star.js";
import {Ship} from "/js/modules/ship.js";
import {Bar} from "/js/modules/bar.js";

export class Homepage {
    constructor(build) {
        this.build = build;

        this.updateSubscribers = [];
        this.drawSubscribers = [];
        this.resizeSubscribers = [];

        this.initMouse();
        this.initScreen();
        this.initCanvas();

        this.initFrames();
        this.initStars();
        this.initBars();
        this.initSprite();
        this.initFonts();
        this.initRunner();
        this.initProfiles();
        this.initShip();


        this.audio = document.getElementById('audio');

        this.speaker = new Speaker(this, this.sprite);
    }

    addUpdateSubscriber(subscriber) {
        this.updateSubscribers.push(subscriber);
    }

    addDrawSubscriber(subscriber) {
        this.drawSubscribers.push(subscriber);
    }

    addResizeSubscriber(subscriber) {
        this.resizeSubscribers.push(subscriber);
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

        window.addEventListener("resize", this.resize.bind(this));
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
        this.canvas.addEventListener("mousemove", this.mouseHandler.bind(this));
        this.canvas.addEventListener("touchend", this.touchHandler.bind(this));
        this.canvas.addEventListener("click", this.clickHandler.bind(this));
    }

    touchHandler(e) {
        this.mouseHandler(e.changedTouches[0]);
        this.touched = true;
        this.clearTouch();
    }

    clickHandler() {
        this.clicked = true;
        this.clearTouch();
    }

    mouseHandler(e) {
        this.mx = e.clientX;
        if (this.ox === -1) this.ox = this.mx;
        this.my = e.clientY;
        if (this.oy === -1) this.oy = this.my;
    }

    clearTouch() {
        const me = this;
        setTimeout(() => {
            me.touched = me.clicked = false;
        }, 200);
    }

    addSpriteEventListeners() {
        const me = this;
        this.sprite.addEventListener('load', () => window.requestAnimationFrame(me.animate.bind(me)));
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

        this.updateSubscribers.forEach(subscriber => subscriber.update());

        if (this.barsEnabled && this.visibleBarsCount === 0) {
            this.enableBars();
        }


        /*

        sin += .002 * sinDir;
        if (sin > 1 || sin < -1) sinDir *= -1;
        /*


         */
    }

    draw() {
        this.ctx.fillStyle = "#000";
        this.ctx.clearRect(0, 0, this.w, this.h);

        this.drawSubscribers.forEach((subscriber) => subscriber.draw());

        /*
        let c, fx, i, x, xoffs, yoffs;


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

        */

        /*

        pages[page].draw();


         */
    }

    resize() {
        this.w = this.canvas.width = document.documentElement.clientWidth;
        this.h = this.canvas.height = document.documentElement.clientHeight;
        this.y = this.h * .5;
        this.yh = this.y * .5;

        this.sw = this.w / this.ow;
        this.sy = this.h / this.oh;
        this.ow = this.w;
        this.oh = this.h;

        this.resizeSubscribers.forEach((subscriber) => subscriber.resize());
    }

    initCanvas() {
        this.canvas = this.createCanvas();
        this.addCanvasEventlisteners();
        this.ctx = this.canvas.getContext("2d");
    }

    run() {
        this.sprite.src = 'img/sprite.png?v=' + this.build;
    }

    initProfiles() {
        this.profiles = [];
        this.shot = 0;

        const p = document.querySelectorAll("a.profile");
        for (let i = 0; i < p.length; i++) {
            this.profiles.push(new Profile(this, p[i], this.runner));
        }

        this.shootProfile();
    }

    initFonts() {
        this.fs = 32;
        this.hfs = this.fs * .5;
    }

    initRunner() {
        this.runner = new Runner(this, this.sprite);
    }

    initSprite() {
        this.sprite = new Image();
        this.addSpriteEventListeners();
    }

    initFrames() {
        this.frame = 0;
        this.fps = 60 / 1000;
        this.timeElapsed = 0;
    }

    initStars() {
        this.stars = [];
        this.starCount = 300;
        this.starTail = 8;

        for (let i = 0; i < this.starCount; i++) {
            this.stars.push(new Star(this, Math.random() * this.w, Math.random() * this.h, Math.random() * .5, Math.random(), Math.random() * 4, Math.random()));
        }
    }

    initBars() {
        this.bars = [];
        this.barCount = 4;
        this.visibleBarsCount = 0;
        this.barsEnabled = false;

        for (let i = 0; i < this.barCount; i++) {
            this.bars.push(new Bar(this));
        }
    }

    enableBars() {
        this.bars.forEach(bar => bar.visible = true);
        this.visibleBarsCount = this.barCount;
        this.barsEnabled = true;
    }

    initShip() {
        this.ship = new Ship(this, this.sprite, this.runner);
    }

    shootProfile() {
        if (this.runner.run) {
            for (let i = 0, l = this.profiles.length; i < l; i++) {
                this.shot++;
                if (this.shot > l) this.shot = 0;
                if (this.profiles[i].visible) continue;

                this.profiles[i].reset();
                break;
            }
        }
        window.setTimeout(this.shootProfile.bind(this), 1000 + Math.random() * 2000);
    }
}
