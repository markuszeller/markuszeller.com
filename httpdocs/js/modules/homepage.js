import {Speaker} from "/js/modules/speaker.js";
import {Profile} from "/js/modules/profile.js";
import {Runner} from "/js/modules/runner.js";
import {Star} from "/js/modules/star.js";
import {Ship} from "/js/modules/ship.js";
import {Bar} from "/js/modules/bar.js";
import {Page} from "/js/modules/page.js";
import {Scroller} from "/js/modules/scroller.js";

export class Homepage {
    constructor(build) {
        this.build = build;

        this.initSubscribers();

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

        this.initPages();
        this.initScroller();

        this.initSpeaker();
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

        addEventListener("resize", this.resize.bind(this));
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
        this.sprite.addEventListener('load', () => requestAnimationFrame(me.animate.bind(me)));
    }

    animate(t) {
        if (t - this.timeElapsed >= this.fps) {
            this.update();
            this.draw();
            this.timeElapsed = t;
            ++this.frame;
        }

        requestAnimationFrame(this.animate.bind(this));
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
    }

    draw() {
        this.clearScreen();
        this.drawSubscribers.forEach((subscriber) => subscriber.draw());
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
        for (let i = 0; i < p.length; ++i) {
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

        for (let i = 0; i < this.starCount; ++i) {
            this.stars.push(new Star(this, Math.random() * this.w, Math.random() * this.h, Math.random() * .5, Math.random(), Math.random() * 4, Math.random()));
        }
    }

    initBars() {
        this.bars = [];
        this.barCount = 4;
        this.visibleBarsCount = 0;
        this.barsEnabled = false;

        for (let i = 0; i < this.barCount; ++i) {
            this.bars.push(new Bar(this));
        }
    }

    enableBars() {
        this.bars.forEach(bar => bar.visible = true);
        this.visibleBarsCount = this.barCount;
        this.barsEnabled = true;
    }

    initShip() {
        new Ship(this, this.sprite, this.runner);
    }

    shootProfile() {
        if (this.runner.run) {
            for (let i = 0, l = this.profiles.length; i < l; ++i) {
                if (++this.shot > l) this.shot = 0;
                if (this.profiles[i].visible) continue;

                this.profiles[i].reset();
                break;
            }
        }
        setTimeout(this.shootProfile.bind(this), 1000 + Math.random() * 2000);
    }

    initSpeaker() {
        this.audio = document.getElementById('audio');
        new Speaker(this, this.sprite);
    }

    initPages() {
        this.pages = [];
        this.pageScrollerSpeed = 1;
        this.pageIndex = -1;
        this.charSet = " ?!\"=/%-'(),.:;0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let index = 0;
        document.querySelectorAll('article.page').forEach(article => {
            this.pages.push(new Page(this, index++, article.firstChild.nodeValue, this.sprite));
        });
        this.pages[0].reset();
    }

    initScroller() {
        new Scroller(this, document.getElementById("text").firstChild.nodeValue, this.sprite);
    }

    initSubscribers() {
        this.updateSubscribers = [];
        this.drawSubscribers = [];
        this.resizeSubscribers = [];
    }

    clearScreen() {
        this.ctx.fillStyle = "#000";
        this.ctx.clearRect(0, 0, this.w, this.h);
    }
}
