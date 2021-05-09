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
        this.pos = 0;
        this.frame = 0;
    }

    draw() {
        if(this.homepage.pageIndex !== this.index) return;

        let x = -this.homepage.hfs - this.frame;
        let y = this.homepage.hfs * Math.sin(this.frame * .01) + this.homepage.hfs + this.homepage.hfs;

        for (let i = Math.floor(this.pos), l = this.text.length; i < l; i++) {
            let c = this.text[i];
            let fx = this.homepage.charSet.indexOf(c);
            if (fx === -1) fx = 0;
            x += this.homepage.hfs;
            if (x < -this.homepage.hfs) continue;
            this.homepage.ctx.drawImage(this.sprite, fx * this.homepage.hfs, 0, this.homepage.hfs, this.homepage.hfs, x, y, this.homepage.hfs, this.homepage.hfs);

        }
    }

    reset() {
        this.homepage.pageIndex++;
        if (this.homepage.pageIndex >= this.homepage.pages.length) this.homepage.pageIndex = 0;
        this.homepage.pages[this.homepage.pageIndex].pos = 0;
        this.homepage.pages[this.homepage.pageIndex].frame = -this.homepage.w - this.homepage.hfs;
    }

    update() {
        if(this.homepage.pageIndex !== this.index) return;

        this.frame += this.homepage.pageScrollerSpeed;
        if (this.frame > this.homepage.hfs * this.text.length) this.reset();
    }
}
