export class Profile {
    constructor(homepage, el, runner) {
        this.homepage = homepage;
        this.el = el;
        this.runner = runner;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
    }

    init() {
        this.xoffs = this.homepage.profiles.length * 32;
        this.y = this.homepage.h;
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
        this.y = this.homepage.h - this.homepage.fs;
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

        this.homepage.ctx.drawImage(this.homepage.sprite, this.xoffs, 49, this.homepage.fs, this.homepage.fs, this.x, this.y, this.size, this.size);
    }

    update() {
        if (!this.visible || this.isClicked()) return;

        if (this.acc > 0) {
            this.acc -= .01;
            this.y -= this.acc;
        }
        this.vel -= .001;
        if (this.vel < 0) this.vel -= .002;
        this.y -= this.step > this.homepage.fs ? this.vel : .5;
        if (this.y < -this.homepage.fs || this.y > this.homepage.h) this.die = true;

        this.coll = this.detectCollision();

        const cos = Math.cos(this.step * .02);
        if (this.coll) {
            if (this.step > this.homepage.fs * 2) this.die = true;
        }

        if (this.step > this.homepage.fs) {
            if (this.vel > 0) this.x += Math.abs(this.vel * this.homepage.fs) * cos / this.homepage.profiles.length;
            else this.y += Math.abs(this.vel * this.vel);
        } else this.x = this.runner.x + (this.runner.dir > 0 ? this.runner.w * this.runner.dir : 0);

        this.step++;

        if (this.step < this.homepage.fs) this.size++;
        if (this.die) {
            this.size--;
            if (this.size === 0) this.visible = false;
        }
    }

    detectCollision() {
        for (let i = 0, l = this.homepage.profiles.length; i < l; i++) {
            let fitX = this.homepage.profiles[i].x + this.homepage.fs >= this.x && this.homepage.profiles[i].x < this.x + this.homepage.fs;
            let fitY = this.homepage.profiles[i].y + this.homepage.fs >= this.y && this.homepage.profiles[i].y <= this.y + this.homepage.fs;
            if (this.homepage.profiles[i].visible && this.homepage.profiles[i].xoffs !== this.xoffs && fitX && fitY) {
                this.coll = this.vel > 0 && Math.random() > .9;
                return true;
            }
        }
        return false;
    }

    isClicked() {
        if (this.homepage.mx
            && this.homepage.my
            && this.homepage.mx > this.x
            && this.homepage.mx < this.x + this.homepage.fs
            && this.homepage.my > this.y
            && this.homepage.my < this.y + this.homepage.fs
        ) {
            if (this.homepage.touched) {
                this.homepage.touched = this.homepage.clicked = false;
                document.location.href = this.el.href;
            }
            if (this.homepage.clicked) {
                this.el.click();
                this.homepage.touched = this.homepage.clicked = false;
            }
            return true;
        }
        return false;
    }
}
