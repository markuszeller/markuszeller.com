"use strict";
window.addEventListener("load", function () {

    let build = 56;
    let sprite = new Image();
    sprite.addEventListener('load', function () {
        window.requestAnimationFrame(animate);
    });
    sprite.src = 'img/sprite.png?v=' + build;
    let starCount = 300;
    let barCount = 2;
    let barVisible = 0;
    let stars = [];
    let pages = [];
    let profiles = [];
    let bars = [];
    let shot = -1;
    let page = -1;
    let i, l, dx, dy;
    let mx = -1;
    let ox = -1;
    let my = -1;
    let oy = -1;
    let frame = 0;
    let fs = 32;
    let hfs = fs * .5;
    let sin = 0;
    let sinDir = 1;
    let sFontY = 16;
    let touched = false;
    let clicked = false;
    let frameRate = 1000 / 60;
    let fps = 60 / 1000;
    let timeElapsed = frameRate;

    let w = document.documentElement.clientWidth;
    let h = document.documentElement.clientHeight;
    let y = h * .5;
    let yh = y * .5;
    let ow = w;
    let oh = h;

    let chars = " ?!\"=/%-'(),.:;0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let text = document.getElementById("text").firstChild.nodeValue;

    let ctrlEsc = String.fromCharCode(27);

    let spaces = "";
    for (i = 0, l = w / fs + 1; i < l; i++) spaces += " ";
    text = spaces + text + spaces + ctrlEsc;
    text = text.toUpperCase();

    let canvas1 = document.body.appendChild(document.createElement("canvas"));
    let audio = document.getElementById('audio');
    canvas1.width = w;
    canvas1.height = h;
    canvas1.style.position = "fixed";
    canvas1.style.top = '0';
    canvas1.style.left = '0';

    canvas1.addEventListener("mousemove", mouseHandler);
    canvas1.addEventListener("touchend", function (e) {
        mouseHandler(e.changedTouches[0]);
        touched = true;
        clearTouch();
    });
    canvas1.addEventListener("click", function () {
        clicked = true;
        clearTouch();
    });

    let ctx1 = canvas1.getContext("2d");

    function Ship() {
        this.size = 128;
        this.x = w / 2 - this.size - this.size / 2;
        this.y = -this.size;
        this.acc = h / this.size / 2;
        this.vel = 16;
        this.frame = 0;
        this.visible = true;
        this.scene = 0;
        this.step = 0;
        this.freeze = 0;
        this.yoffs = [120, 375, 247, 375, 120];
        this.forwards = true;
    }

    Ship.prototype.update = function () {
        if (!this.visible) return;
        let anim = 0 === frame % 4;
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
                if (this.vel > 0) this.vel -= .1;
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
                            b.init();
                            b.visible = true;
                            barVisible++;
                            bars.push(b);
                        }
                    }
                }
                break;
        }

        this.x += Math.sin(frame / 8) * this.vel;
    };

    Ship.prototype.draw = function () {
        if (!this.visible) return;
        ctx1.drawImage(sprite, this.size * this.frame, this.yoffs[this.scene], this.size, this.size, this.x, this.y, this.size, this.size);
    };

    function Profile(el) {
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

    Profile.prototype.init = function () {
        this.y = h - fs;
        this.visible = true;
        this.vel = .5 + Math.random();
        this.step = 0;
        this.die = false;
        this.size = 0;
        this.coll = false;
        this.acc = 1 + Math.random() * 2;
    };

    Profile.prototype.draw = function () {
        if (!this.visible) return;

        ctx1.drawImage(sprite, this.xoffs, 49, fs, fs, this.x, this.y, this.size, this.size);
    };

    Profile.prototype.update = function () {
        let i, l, fitX, fitY, cos;
        if (!this.visible) return;

        if (mx && my && mx > this.x && mx < this.x + fs && my > this.y && my < this.y + fs) {
            if (touched) {
                touched = clicked = false;
                document.location.href = this.el.href;
            }
            if (clicked) {
                this.el.click();
                touched = clicked = false;
            }
            return;
        }

        if (this.acc > 0) {
            this.acc -= .01;
            this.y -= this.acc;
        }
        this.vel -= .001;
        if (this.vel < 0) this.vel -= .002;
        this.y -= this.step > fs ? this.vel : .5;
        if (this.y < -fs || this.y > h) this.die = true;

        this.coll = false;
        for (i = 0, l = profiles.length; i < l; i++) {
            fitX = profiles[i].x + fs >= this.x && profiles[i].x < this.x + fs;
            fitY = profiles[i].y + fs >= this.y && profiles[i].y <= this.y + fs;
            if (profiles[i].visible && profiles[i].xoffs !== this.xoffs && fitX && fitY) {
                this.coll = this.vel > 0 && Math.random() > .9;
                break;
            }
        }

        cos = Math.cos(this.step * .05);
        if (this.coll) {
            if (this.step > fs * 2) this.die = true;
        }

        if (this.step > fs) {
            if (this.vel > 0) this.x += Math.abs(this.vel * fs) * cos / profiles.length;
            else this.y += Math.abs(this.vel * this.vel * this.vel);
        } else this.x = runner.x + (runner.dir > 0 ? runner.w * runner.dir : 0);

        this.step++;

        if (this.step < fs) this.size++;
        if (this.die) {
            this.size--;
            if (this.size === 0) this.visible = false;
        }
    };

    function Runner() {
        this.frame = 0;
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
        this.speed = this.w / frameRate * .5;
        this.jumpY = 0;
    }

    Runner.prototype.draw = function () {
        if (!this.visible) return;
        let frame = this.beam ? 0 : Math.floor(timeElapsed * (fps / this.frames) % this.frames);
        ctx1.drawImage(sprite, this.dir > 0 ? frame * this.w : this.frames * this.w * 2 - (frame * this.w) - this.w, 82, this.w, this.h, this.x, this.y - this.jumpY, this.w, this.h);
    };

    Runner.prototype.update = function () {
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

        this.x += this.speed * (.5 * Math.cos(timeElapsed * 0.0025) + .5) * this.dir + this.dir;

        if (this.x > w - this.w) {
            this.x = w - this.w;
            this.dir = -1;
        }
        if (this.x < 0) {
            this.x = 0;
            this.dir = 1;
        }
    };

    Runner.prototype.resize = function () {
        this.y = h - this.h;
    };

    function Page(text) {
        this.text = text.toUpperCase();
        this.pos = 0;
    }

    Page.prototype.draw = function () {
        let x = -hfs - this.frame;
        let y = hfs * Math.sin(this.frame * .01) + hfs + hfs;

        for (let i = Math.floor(this.pos), l = this.text.length; i < l; i++) {
            let c = this.text[i];
            let fx = chars.indexOf(c);
            if (fx === -1) fx = 0;
            x += hfs;
            if (x < -hfs) continue;
            ctx1.drawImage(sprite, fx * hfs, 0, hfs, hfs, x, y, hfs, hfs);
        }
    };

    Page.prototype.init = function () {
        page++;
        if (page >= pages.length) page = 0;
        pages[page].pos = 0;
        pages[page].frame = -w - hfs;
    };

    Page.prototype.update = function () {
        this.frame += 3;
        if (this.frame > hfs * this.text.length) this.init();
    };

    function Bar() {
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

    Bar.prototype.init = function () {
        let v = 0;
        let c, i;
        this.y = -Math.random() * y - this.h - this.h;
        this.off = 0;

        while (!v) {
            this.col = [];
            for (i = 0; i < 3; i++) {
                c = Math.random() > .5;
                v += c;
                this.col.push(c * 255);
            }
        }
        this.vel = 0;
        this.visible = false;
        barVisible--;
    };

    Bar.prototype.update = function () {
        if (!this.visible) return;

        this.vel += .1 * this.velDir;
        this.y += this.vel * this.velDir;

        if (this.y > h + this.h) {
            this.vel *= .7 + Math.random() * .2;
            this.velDir *= -1;
            this.y = h + this.h;
            if (this.off++ > this.h) {
                this.init();
            }
        } else this.off = 0;
    };

    Bar.prototype.draw = function () {
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
    };

    Bar.prototype.paint = function (i) {
        this.r = this.col[0] / this.res * i;
        this.g = this.col[1] / this.res * i;
        this.b = this.col[2] / this.res * i;
        ctx1.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
        ctx1.fillRect(0, this.y + this.ys, w, 4);
        this.ys += 4;
    };

    function Star(x, y, velocity, brightness, size, acc) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.brightness = brightness;
        this.size = size;
        this.acc = acc;
        this.initAcc = acc;
        this.tail = 0;
    }

    function Speaker() {
        this.isOn = false;
        this.srcX = 1050;
        this.srcY = 120;
        this.size = 64;
        this.hs = this.size / 2;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.acc = .5;

        this.offY = this.hs;
        this.onY = h - this.size - this.size;

        this.cx = w - this.size - this.size;
        this.cy = this.hs;

        Speaker.prototype.update = function () {

            if (this.speed) {
                this.speed += this.acc;

                if (this.isOn) {
                    this.cy += this.speed;
                    if (this.cy >= this.onY) {
                        this.y = this.onY;
                        this.speed = 0;
                    }
                } else {
                    this.cy -= this.speed;
                    if (this.cy <= this.offY) {
                        this.y = this.offY;
                        this.speed = 0;
                    }
                }
            }

            this.x = this.cx + (this.hs * Math.sin(timeElapsed * .0005));
            this.y = this.cy + (this.hs * Math.cos(timeElapsed * .0005));

            if (mx && my && mx > this.x && mx < this.x + this.size && my > this.y && my < this.y + this.size) {
                if (touched || clicked) {
                    touched = clicked = false;
                    this.isOn = !this.isOn;
                    if (this.isOn) audio.play(); else audio.pause();
                    this.speed = this.acc;
                }
            }
        };

        Speaker.prototype.draw = function () {
            ctx1.drawImage(sprite, this.srcX + (this.isOn ? this.size : 0), this.srcY, this.size, this.size, this.x, this.y, this.size, this.size);
        };

    }

    for (i = 0; i < starCount; i++) {
        stars.push(new Star(Math.random() * w, Math.random() * h, Math.random() * .01, Math.random(), Math.random() * 4, Math.random() * 2));
    }

    let p = document.querySelectorAll('article.page');
    for (i = 0, l = p.length; i < l; i++) {
        pages.push(new Page(p[i].firstChild.nodeValue));
    }
    pages[0].init();

    p = document.querySelectorAll("a.profile");
    for (i = 0; i < p.length; i++) {
        profiles.push(new Profile(p[i]));
    }

    let ship = new Ship();
    let runner = new Runner();
    let speaker = new Speaker();

    function update() {
        dx = ox - mx;
        dy = oy - my;
        ox = mx;
        oy = my;
        stars.forEach(function (star) {
            star.acc -= star.acc * .02;
            if (dx > 0) {
                star.acc += dx * star.velocity * 5;
                star.tail += dx * star.velocity * 3;
                if (star.tail > 80) star.tail = 80;
            }
            star.tail -= star.tail * .05;
            if (star.tail < 0) star.tail = 0;
            if (star.acc < star.initAcc) star.acc = star.initAcc;
            star.x -= star.velocity + star.acc;
            if (star.x < -star.size - star.tail) star.x = w + star.velocity + star.acc;
            if (dy) star.y += dy * .1;
        });

        sin += .002 * sinDir;
        if (sin > 1 || sin < -1) sinDir *= -1;
        pages[page].update();
        runner.update();
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

        speaker.update();
    }

    function draw() {
        ctx1.fillStyle = "#000";
        ctx1.clearRect(0, 0, w, h);

        let c, fx, i, x, xoffs, yoffs;

        stars.forEach(function (star) {
            if (star.x < w && star.y > 0 && star.y < h) {
                ctx1.fillStyle = "rgba(255, 255, 255, " + star.brightness + ")";
                ctx1.fillRect(star.x, star.y, star.size + star.tail, star.size);
            }
        });

        bars.forEach(function (b) {
            b.draw();
        });

        frame++;
        xoffs = w - 4 * frame;
        for (i = 0; i < text.length; i++) {
            yoffs = y + Math.cos(frame * .04 + i * .1) * Math.sin(sin) * yh - hfs;
            c = text[i];
            fx = chars.indexOf(c);
            if (fx === -1) fx = 0;
            x = xoffs + i * fs;
            if (x > -fs && x < w) {
                ctx1.drawImage(sprite, fx * fs, sFontY, fs, fs, x, yoffs, fs, fs);
                if (c === ctrlEsc) frame = 0;
            }
        }
        runner.draw();
        pages[page].draw();
        profiles.forEach(function (p) {
            p.draw()
        });
        ship.draw();
        speaker.draw();
    }

    function animate(t) {
        if (t - timeElapsed >= frameRate) {
            update();
            draw();
            timeElapsed = t;
        }
        window.requestAnimationFrame(animate);
    }

    function mouseHandler(e) {
        mx = e.clientX;
        if (ox === -1) ox = mx;
        my = e.clientY;
        if (oy === -1) oy = my;
    }

    function clearTouch() {
        window.setTimeout(function () {
            touched = clicked = false;
        }, 200);
    }

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
    });

    function shoot() {
        if (runner.run) {
            for (let i = 0, l = profiles.length; i < l; i++) {
                shot++;
                if (shot > l) shot = 0;
                if (profiles[i].visible) continue;

                profiles[i].init();
                break;
            }
        }
        window.setTimeout(shoot, 1000 + Math.random() * 2000);
    }

    window.setTimeout(shoot, 2000 + Math.random() * 2000);

});
