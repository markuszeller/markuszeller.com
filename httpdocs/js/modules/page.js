export class Page {
    constructor(homepage, index, text, sprite) {
        this.homepage = homepage;
        this.index = index;
        this.text = text.toUpperCase();
        this.sprite = sprite;

        this.init();
        this.homepage.addUpdateSubscriber(this);
        this.homepage.addDrawSubscriber(this);
    }

    init() {
        this.x = 0;
    }

    draw() {
        if(this.homepage.pageIndex !== this.index) return;

        let x = -this.homepage.hfs - this.x;
        let y = this.homepage.hfs * Math.sin(this.x * .01) + this.homepage.hfs + this.homepage.hfs;

        for (let i = 0, l = this.text.length; i < l; i++) {
            x += this.homepage.hfs;
            if(x < -this.homepage.hfs) continue;
            if(x > this.homepage.w) break;
            let c = this.text[i];
            let fx = this.homepage.charSet.indexOf(c);
            if (fx === -1) fx = 0;
            this.homepage.ctx.drawImage(this.sprite, fx * this.homepage.hfs, 0, this.homepage.hfs, this.homepage.hfs, x, y, this.homepage.hfs, this.homepage.hfs);
        }
    }

    reset() {
        this.homepage.pageIndex++;
        if (this.homepage.pageIndex >= this.homepage.pages.length) this.homepage.pageIndex = 0;
        this.homepage.pages[this.homepage.pageIndex].x = -this.homepage.w - this.homepage.hfs;
    }

    update() {
        if(this.homepage.pageIndex !== this.index) return;

        this.x += this.homepage.pageScrollerSpeed;
        if (this.x > this.homepage.hfs * this.text.length) this.reset();
    }
}
