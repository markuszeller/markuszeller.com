export class Runner {
    constructor(homepage, sprite) {
        this.homepage = homepage;
        this.sprite = sprite;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
        this.homepage.addResizeSubscriber(this);
    }

    init() {
        this.frames = 11;
        this.dir = 1;
        this.w = 44;
        this.h = 37;
        this.hh = 37 * .5;
        this.x = this.homepage.w / 2 - 28;
        this.visible = false;
        this.run = false;
        this.y = this.homepage.h;
        this.beam = false;
        this.speed = this.homepage.fps * 8;
        this.jumpY = 0;
    }

    draw() {
        if (!this.visible) return;
        let frame = this.beam ? 0 : Math.floor(this.homepage.timeElapsed * (this.homepage.fps / this.frames) % this.frames);
        this.homepage.ctx.drawImage(this.sprite, this.dir > 0 ? frame * this.w : this.frames * this.w * 2 - (frame * this.w) - this.w, 82, this.w, this.h, this.x, this.y - this.jumpY, this.w, this.h);
    }

    update() {
        if (!this.visible) return;
        this.jumpY = this.hh * Math.abs(Math.sin(this.homepage.timeElapsed * 0.0025));

        const footY = this.homepage.h - this.h;
        if (this.beam) {
            this.jumpY = 0;
            this.y += .6;
            if (this.y > footY) {
                this.y = footY;
            }
            return;
        }

        this.x += this.speed * ((.5 * Math.cos(this.homepage.timeElapsed * 0.0025) + .5) * this.dir + this.dir);

        if (this.x > this.homepage.w - this.w) {
            this.x = this.homepage.w - this.w;
            this.dir = -1;
        }
        if (this.x < 0) {
            this.x = 0;
            this.dir = 1;
        }
    }

    resize() {
        this.y = this.homepage.h - this.h;
    };
}
