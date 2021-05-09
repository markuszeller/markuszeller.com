"use strict";
import {Homepage} from "/js/modules/homepage.js";

window.addEventListener("load", function () {

    const build = 56;
    const homepage = new Homepage(build);
    homepage.run();


    return;

    let pages = [];
    let shot = -1;
    let page = -1;
    let i, l, dx, dy;
    let sin = 0;
    let sinDir = 1;
    let sFontY = 16;
    let bigScrollerSpeed = 2;
    let pageScrollerSpeed = 1;


    let chars = " ?!\"=/%-'(),.:;0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let text = document.getElementById("text").firstChild.nodeValue;

    let ctrlEsc = String.fromCharCode(27);

    let spaces = "";
    for (i = 0, l = w / fs + 1; i < l; i++) spaces += " ";
    text = spaces + text + spaces + ctrlEsc;
    text = text.toUpperCase();




    class Page {
        constructor(text) {
            this.text = text.toUpperCase();
            this.pos = 0;
            this.frame = 0;
        }

        draw() {
            let frame = Math.floor(this.frame / pageScrollerSpeed);
            let x = -hfs - frame;
            let y = hfs * Math.sin(frame * .01) + hfs + hfs;

            for (let i = Math.floor(this.pos), l = this.text.length; i < l; i++) {
                let c = this.text[i];
                let fx = chars.indexOf(c);
                if (fx === -1) fx = 0;
                x += hfs;
                if (x < -hfs) continue;
                ctx.drawImage(sprite, fx * hfs, 0, hfs, hfs, x, y, hfs, hfs);
            }
        }

        reset() {
            page++;
            if (page >= pages.length) page = 0;
            pages[page].pos = 0;
            pages[page].frame = -w - hfs;
        }

        update() {
            this.frame++;
            if (this.frame > hfs * this.text.length) this.reset();
        }
    }



    let p = document.querySelectorAll('article.page');
    for (i = 0, l = p.length; i < l; i++) {
        pages.push(new Page(p[i].firstChild.nodeValue));
    }
    pages[0].reset();

    let ship = new Ship();
    let runner = new Runner();
    let speaker = new Speaker();




    window.setTimeout(shoot, 2000 + Math.random() * 2000);
});
