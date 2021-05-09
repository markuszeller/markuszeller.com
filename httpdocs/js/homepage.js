"use strict";
import {Homepage} from "/js/modules/homepage.js";

window.addEventListener("load", function () {

    const build = 56;
    const homepage = new Homepage(build);
    homepage.run();


    return;

    let page = -1;
    let i, l, dx, dy;
    let sin = 0;
    let sinDir = 1;
    let sFontY = 16;
    let bigScrollerSpeed = 2;


    let text = document.getElementById("text").firstChild.nodeValue;

    let ctrlEsc = String.fromCharCode(27);

    let spaces = "";
    for (i = 0, l = w / fs + 1; i < l; i++) spaces += " ";
    text = spaces + text + spaces + ctrlEsc;
    text = text.toUpperCase();


    let ship = new Ship();
    let runner = new Runner();
    let speaker = new Speaker();




    window.setTimeout(shoot, 2000 + Math.random() * 2000);
});
