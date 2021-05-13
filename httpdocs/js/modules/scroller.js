export class Scroller {
    constructor(homepage, text, sprite) {
        this.homepage = homepage;
        this.text = text;
        this.sprite = sprite;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
    }

    init() {
        this.sin = 0;
        this.sinDir = 1;
        this.sFontY = 16;
        this.speed = 2;
        this.addPrefixSpaces();
    }

    update() {
        this.sin += .002 * this.sinDir;
        if (this.sin > 1 || this.sin < -1) this.sinDir *= -1;
    }

    draw() {
        let bsFrame = this.homepage.frame * this.speed;
        let xoffs = this.homepage.w - bsFrame;
        for (let i = 0; i < this.text.length; ++i) {
            const yoffs = this.homepage.y + Math.cos((this.homepage.frame / this.speed) * .04 + i * .1) * Math.sin(this.sin) * this.homepage.yh - this.homepage.hfs;
            const c = this.text[i];
            let fx = this.homepage.charSet.indexOf(c);
            if (fx === -1) fx = 0;
            let x = xoffs + i * this.homepage.fs;
            if (x > -this.homepage.fs && x < this.homepage.w) {
                this.homepage.ctx.drawImage(this.sprite, fx * this.homepage.fs, this.sFontY, this.homepage.fs, this.homepage.fs, x, yoffs, this.homepage.fs, this.homepage.fs);
                if (c === this.ctrlEsc) this.homepage.frame = 0;
            }
        }
    }

    addPrefixSpaces() {
        let spaces = "";
        this.ctrlEsc = String.fromCharCode(27)
        for (let i = 0, l = this.homepage.w / this.homepage.fs + 1; i < l; ++i) spaces += " ";
        const text = spaces + this.text + spaces + this.ctrlEsc;
        this.text = text.toUpperCase();
    }
}
