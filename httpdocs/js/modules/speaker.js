export class Speaker {
    constructor(homepage, sprite) {
        this.homepage = homepage;
        this.sprite = sprite;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
        this.homepage.addResizeSubscriber(this);
    }

    init() {
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
        this.onY = this.homepage.h - this.size - this.size;

        this.resize();
        this.cy = this.hs;
    }

    update() {
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

        this.x = this.cx + (this.hs * Math.sin(this.homepage.timeElapsed * .0005));
        this.y = this.cy + (this.hs * Math.cos(this.homepage.timeElapsed * .0005));

        if (this.homepage.mx
            && this.homepage.my
            && this.homepage.mx > this.x
            && this.homepage.mx < this.x + this.size
            && this.homepage.my > this.y
            && this.homepage.my < this.y + this.size
        ) {
            if (this.homepage.touched || this.homepage.clicked) {
                this.homepage.touched = this.homepage.clicked = false;
                this.isOn = !this.isOn;
                if (this.isOn) this.homepage.audio.play(); else this.homepage.audio.pause();
                this.speed = this.acc;
            }
        }
    }

    draw() {
        this.homepage.ctx.drawImage(this.sprite, this.srcX + (this.isOn ? this.size : 0), this.srcY, this.size, this.size, this.x, this.y, this.size, this.size);
    }

    resize() {
        this.cx = this.homepage.w - this.size - this.size;
    }
}
