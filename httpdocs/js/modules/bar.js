export class Bar {
    constructor(homepage) {
        this.homepage = homepage;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
    }

    init() {
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
        this.reset();
    }

    reset() {
        this.y = -Math.random() * this.homepage.y - this.h - this.h;
        this.off = 0;

        this.col = [];
        for (let i = 0; i < 3; i++) {
            this.col.push(Math.floor(Math.random() * 128 + 128));
        }
        this.vel = 0;
        this.visible = false;
        this.homepage.visibleBarsCount = Math.max(0, --this.homepage.visibleBarsCount);
    }

    update() {
        if (!this.visible || !this.homepage.barsEnabled) return;

        this.vel += .01 * this.velDir;
        this.y += this.vel * this.velDir;

        if (this.y > this.homepage.h + this.h) {
            this.vel *= .7 + Math.random() * .2;
            this.velDir *= -1;
            this.y = this.homepage.h + this.h;
            if (this.off++ > this.h) {
                this.reset();
            }
        } else this.off = 0;
    }

    draw() {
        if (!this.visible || !this.homepage.barsEnabled) return;

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
        this.homepage.ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
        this.homepage.ctx.fillRect(0, this.y + this.ys, this.homepage.w, 4);
        this.ys += 4;
    }
}
