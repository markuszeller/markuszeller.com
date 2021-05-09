export class Ship {
    constructor(homepage, sprite, runner) {
        this.homepage = homepage;
        this.sprite = sprite;
        this.runner = runner;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
    }

    init() {
        this.size = 128;
        this.x = this.homepage.w / 2 - this.size - this.size / 2;
        this.y = -this.size;
        this.acc = this.homepage.h / this.size / 2;
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
        let anim = 0 === this.homepage.frame % 8;
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
                if (this.y < this.homepage.h - this.size) {
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
                        this.runner.y = this.y;
                    }
                }
                break;

            case 2:
                if (anim) {
                    if (this.freeze++ > 40 && this.frame === 0) {
                        this.runner.visible = true;
                        this.runner.beam = true;
                    }
                    if (this.freeze++ > 120 && this.frame === 0) {
                        this.forwards = false;
                        this.freeze = 0;
                        this.runner.beam = false;
                        this.runner.run = true;
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
                        this.runner.run = true;
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
                    this.homepage.enableBars();
                }
                break;
        }
        this.x = this.homepage.w * .5 - this.size * .5 + (Math.sin(this.homepage.frame / 16) * this.vel);
    }

    draw() {
        if (!this.visible) return;
        this.homepage.ctx.drawImage(this.sprite, this.size * this.frame, this.yoffs[this.scene], this.size, this.size, this.x, this.y, this.size, this.size);
    }
}
