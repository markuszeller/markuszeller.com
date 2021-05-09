"use strict";
import {Homepage} from "/js/modules/homepage.js";

window.addEventListener("load", function () {

    const build = 56;
    const homepage = new Homepage(build);
    homepage.run();


    return;

    let starCount = 300;
    let starTail = 8;
    let barCount = 2;
    let barVisible = 0;
    let stars = [];
    let pages = [];
    let profiles = [];
    let bars = [];
    let shot = -1;
    let page = -1;
    let i, l, dx, dy;
    let fs = 32;
    let hfs = fs * .5;
    let sin = 0;
    let sinDir = 1;
    let sFontY = 16;
    let bigScrollerSpeed = 2;
    let pageScrollerSpeed = 1;


    let chars = " ?!\"=/%-'(),.:;0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let text = document.getElementById("text").firstChild.nodeValue;

    let ctrlEsc = String.fromCharCode(27);

    let spaces = "";
    for (i = 0, l = w / fs + 1; i < l; i++) spaces += " ";
    text = spaces + text + spaces + ctrlEsc;
    text = text.toUpperCase();



    class Ship {
        constructor() {
            this.size = 128;
            this.x = w / 2 - this.size - this.size / 2;
            this.y = -this.size;
            this.acc = h / this.size / 2;
            this.vel = this.size;
            this.frame = 0;
            this.visible = true;
            this.scene = 0;
            this.freeze = 0;
            this.yoffs = [120, 375, 247, 375, 120];
            this.forwards = true;
        }

        update() {
            if (!this.visible) return;
            let anim = 0 === frame % 8;
            if (this.forwards && anim) {
                this.frame++;
                if (this.frame > 7) this.frame = 0;
            }
            if (!this.forwards && anim) {
                this.frame--;
                if (this.frame < 0) this.frame = 7;
            }

            switch (this.scene) {
                case 0:
                    if (this.y < h - this.size) {
                        this.y += 1;
                        this.acc -= .01;
                    } else if (this.frame === 0 && anim) this.scene++;
                    if (this.acc > 0) this.y += this.acc;
                    if (this.vel > 0) this.vel -= .6;
                    break;

                case 1:
                    if (anim) {
                        if (this.freeze++ >= 7) {
                            this.freeze = 0;
                            this.scene++;
                            runner.y = this.y;
                        }
                    }
                    break;

                case 2:
                    if (anim) {
                        if (this.freeze++ > 40 && this.frame === 0) {
                            runner.visible = true;
                            runner.beam = true;
                        }
                        if (this.freeze++ > 120 && this.frame === 0) {
                            this.forwards = false;
                            this.freeze = 0;
                            runner.beam = false;
                            runner.run = true;
                            this.scene++;
                        }
                    }
                    break;

                case 3:
                    if (anim) {
                        if (this.freeze++ >= 7) {
                            this.scene++;
                            this.acc = 0;
                            this.vel = 0;
                            runner.run = true;
                        }
                    }
                    break;

                case 4:
                    if (this.y > -this.size) {
                        this.y -= 1;
                        this.acc += .02;
                        if (this.acc > 0) this.y -= this.acc;
                        this.vel += .01;
                    } else {
                        this.visible = false;
                        if (!bars.length) {
                            let b;
                            for (i = 0; i < barCount; i++) {
                                b = new Bar();
                                b.reset();
                                b.visible = true;
                                barVisible++;
                                bars.push(b);
                            }
                        }
                    }
                    break;
            }
            this.x = w * .5 - this.size * .5 + (Math.sin(frame / 16) * this.vel);
        }

        draw() {
            if (!this.visible) return;
            ctx.drawImage(sprite, this.size * this.frame, this.yoffs[this.scene], this.size, this.size, this.x, this.y, this.size, this.size);
        }
    }

    class Profile {
        constructor(el) {
            this.el = el;
            this.xoffs = profiles.length * 32;
            this.y = h;
            this.x = 0;
            this.visible = false;
            this.vel = 0;
            this.step = 0;
            this.coll = false;
            this.die = false;
            this.size = 0;
            this.acc = 0;
        }

        reset() {
            this.y = h - fs;
            this.visible = true;
            this.vel = .5 + Math.random();
            this.step = 0;
            this.die = false;
            this.size = 0;
            this.coll = false;
            this.acc = 1 + Math.random() * 2;
        }

        draw() {
            if (!this.visible) return;

            ctx.drawImage(sprite, this.xoffs, 49, fs, fs, this.x, this.y, this.size, this.size);
        }

        update() {
            if (!this.visible || this.isClicked()) return;

            if (this.acc > 0) {
                this.acc -= .01;
                this.y -= this.acc;
            }
            this.vel -= .001;
            if (this.vel < 0) this.vel -= .002;
            this.y -= this.step > fs ? this.vel : .5;
            if (this.y < -fs || this.y > h) this.die = true;

            this.coll = this.detectCollision();

            let cos = Math.cos(this.step * .02);
            if (this.coll) {
                if (this.step > fs * 2) this.die = true;
            }

            if (this.step > fs) {
                if (this.vel > 0) this.x += Math.abs(this.vel * fs) * cos / profiles.length;
                else this.y += Math.abs(this.vel * this.vel);
            } else this.x = runner.x + (runner.dir > 0 ? runner.w * runner.dir : 0);

            this.step++;

            if (this.step < fs) this.size++;
            if (this.die) {
                this.size--;
                if (this.size === 0) this.visible = false;
            }
        }

        detectCollision() {
            for (i = 0, l = profiles.length; i < l; i++) {
                let fitX = profiles[i].x + fs >= this.x && profiles[i].x < this.x + fs;
                let fitY = profiles[i].y + fs >= this.y && profiles[i].y <= this.y + fs;
                if (profiles[i].visible && profiles[i].xoffs !== this.xoffs && fitX && fitY) {
                    this.coll = this.vel > 0 && Math.random() > .9;
                    return true;
                }
            }
            return false;
        }

        isClicked() {
            if (mx && my && mx > this.x && mx < this.x + fs && my > this.y && my < this.y + fs) {
                if (touched) {
                    touched = clicked = false;
                    document.location.href = this.el.href;
                }
                if (clicked) {
                    this.el.click();
                    touched = clicked = false;
                }
                return true;
            }
            return false;
        }
    }

    class Runner {
        constructor() {
            this.frames = 11;
            this.dir = 1;
            this.w = 44;
            this.h = 37;
            this.hh = 37 * .5;
            this.x = w / 2 - 28;
            this.visible = false;
            this.run = false;
            this.y = h;
            this.beam = false;
            this.speed = fps * 8;
            this.jumpY = 0;
        }

        draw() {
            if (!this.visible) return;
            let frame = this.beam ? 0 : Math.floor(timeElapsed * (fps / this.frames) % this.frames);
            ctx.drawImage(sprite, this.dir > 0 ? frame * this.w : this.frames * this.w * 2 - (frame * this.w) - this.w, 82, this.w, this.h, this.x, this.y - this.jumpY, this.w, this.h);
        }

        update() {
            if (!this.visible) return;
            this.jumpY = this.hh * Math.abs(Math.sin(timeElapsed * 0.0025));

            let footY = h - this.h;
            if (this.beam) {
                this.jumpY = 0;
                this.y += .6;
                if (this.y > footY) {
                    this.y = footY;
                }
                return;
            }

            this.x += this.speed * ((.5 * Math.cos(timeElapsed * 0.0025) + .5) * this.dir + this.dir);

            if (this.x > w - this.w) {
                this.x = w - this.w;
                this.dir = -1;
            }
            if (this.x < 0) {
                this.x = 0;
                this.dir = 1;
            }
        }

        resize() {
            this.y = h - this.h;
        };
    }

    class Page {
        constructor(text) {
            this.text = text.toUpperCase();
            this.pos = 0;
            this.frame = 0;
        }

        draw() {
            let frame = Math.floor(this.frame / pageScrollerSpeed);
            let x = -hfs - frame;
            let y = hfs * Math.sin(frame * .01) + hfs + hfs;

            for (let i = Math.floor(this.pos), l = this.text.length; i < l; i++) {
                let c = this.text[i];
                let fx = chars.indexOf(c);
                if (fx === -1) fx = 0;
                x += hfs;
                if (x < -hfs) continue;
                ctx.drawImage(sprite, fx * hfs, 0, hfs, hfs, x, y, hfs, hfs);
            }
        }

        reset() {
            page++;
            if (page >= pages.length) page = 0;
            pages[page].pos = 0;
            pages[page].frame = -w - hfs;
        }

        update() {
            this.frame++;
            if (this.frame > hfs * this.text.length) this.reset();
        }
    }

    class Bar {
        constructor() {
            this.h = 32;
            this.res = 4;
            this.vel = .5;
            this.velDir = 1;
            this.y = 0;
            this.col = [];
            this.visible = false;
            this.off = 0;
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.ys = 0;
        }

        reset() {
            this.y = -Math.random() * y - this.h - this.h;
            this.off = 0;

            let v = 0;
            while (!v) {
                this.col = [];
                for (let i = 0; i < 3; i++) {
                    let c = Math.random() > .5;
                    v += c;
                    this.col.push(c * 255);
                }
            }
            this.vel = 0;
            this.visible = false;
            barVisible--;
        }

        update() {
            if (!this.visible) return;

            this.vel += .01 * this.velDir;
            this.y += this.vel * this.velDir;

            if (this.y > h + this.h) {
                this.vel *= .7 + Math.random() * .2;
                this.velDir *= -1;
                this.y = h + this.h;
                if (this.off++ > this.h) {
                    this.reset();
                }
            } else this.off = 0;
        }

        draw() {
            if (!this.visible) return;

            this.ys = 0;
            let i = 0;

            while (i < this.res) {
                this.paint(i);
                i++;
            }
            while (i--) {
                this.paint(i);
            }
        }

        paint(i) {
            this.r = this.col[0] / this.res * i;
            this.g = this.col[1] / this.res * i;
            this.b = this.col[2] / this.res * i;
            ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
            ctx.fillRect(0, this.y + this.ys, w, 4);
            this.ys += 4;
        }
    }

    class Star {
        constructor(x, y, velocity, brightness, size, acc) {
            this.x = x;
            this.y = y;
            this.velocity = velocity;
            this.brightness = brightness;
            this.size = size;
            this.acc = acc;
            this.initAcc = this.acc;
            this.tail = 0;
        }

        update() {
            this.acc = Math.min(this.acc * .994, starTail);
            if (dx > 0) {
                this.acc += dx * this.velocity * 5;
                this.tail += dx * this.velocity * 3;
                this.tail = Math.min(this.tail, starTail);
            }
            this.tail -= this.tail * .05;
            this.tail = Math.max(0, this.tail);
            this.acc = this.acc > 0 ? this.acc : this.initAcc;
            this.x -= this.velocity + this.acc;
            if (this.x < -this.size - this.tail) this.x = w + this.velocity + this.acc;
            if (dy) this.y += dy * .1;
        }

        draw() {
            if (this.x > w || this.x < 0 || this.y < 0 || this.y > h) return;
            ctx.fillStyle = "rgba(255, 255, 255, " + this.brightness + ")";
            ctx.fillRect(this.x, this.y, this.size + this.tail, this.size);
        }
    }


    for (i = 0; i < starCount; i++) {
        stars.push(new Star(Math.random() * w, Math.random() * h, Math.random() * .5, Math.random(), Math.random() * 4, Math.random()));
    }

    let p = document.querySelectorAll('article.page');
    for (i = 0, l = p.length; i < l; i++) {
        pages.push(new Page(p[i].firstChild.nodeValue));
    }
    pages[0].reset();

    p = document.querySelectorAll("a.profile");
    for (i = 0; i < p.length; i++) {
        profiles.push(new Profile(p[i]));
    }

    let ship = new Ship();
    let runner = new Runner();
    let speaker = new Speaker();

    window.addEventListener("resize", function () {
        let sw, sy;
        w = canvas1.width = document.documentElement.clientWidth;
        h = canvas1.height = document.documentElement.clientHeight;
        y = h * .5;
        yh = y * .5;

        sw = w / ow;
        sy = h / oh;
        ow = w;
        oh = h;
        stars.forEach(function (s) {
            s.x *= sw;
            s.y *= sy;
        });
        runner.resize();
        speaker.resize();
    });

    function shoot() {
        if (runner.run) {
            for (let i = 0, l = profiles.length; i < l; i++) {
                shot++;
                if (shot > l) shot = 0;
                if (profiles[i].visible) continue;

                profiles[i].reset();
                break;
            }
        }
        window.setTimeout(shoot, 1000 + Math.random() * 2000);
    }

    window.setTimeout(shoot, 2000 + Math.random() * 2000);
});