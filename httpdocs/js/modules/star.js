export class Star {
    constructor(homepage, x, y, velocity, brightness, size, acc) {
        this.homepage = homepage;
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.brightness = brightness;
        this.size = size;
        this.acc = acc;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
        this.homepage.addResizeSubscriber(this);
    }

    init() {
        this.initAcc = this.acc;
        this.tail = 0;
    }

    update() {
        this.acc = Math.min(this.acc * .994, this.homepage.starTail);
        if (this.homepage.dx > 0) {
            this.acc += this.homepage.dx * this.velocity * 5;
            this.tail += this.homepage.dx * this.velocity * 3;
            this.tail = Math.min(this.tail, this.homepage.starTail);
        }
        this.tail -= this.tail * .05;
        this.tail = Math.max(0, this.tail);
        this.acc = this.acc > 0 ? this.acc : this.initAcc;
        this.x -= this.velocity + this.acc;
        if (this.x < -this.size - this.tail) this.x = this.homepage.w + this.velocity + this.acc;
        if (this.homepage.dy) this.y += this.homepage.dy * .1;
    }

    draw() {
        if (this.x > this.homepage.w || this.x < -this.size || this.y < -this.size || this.y > this.homepage.h) return;
        this.homepage.ctx.fillStyle = "rgba(255, 255, 255, " + this.brightness + ")";
        this.homepage.ctx.fillRect(this.x, this.y, this.size + this.tail, this.size);
    }

    resize() {
        this.x *= this.homepage.sw;
        this.y *= this.homepage.sy;
    }
}
