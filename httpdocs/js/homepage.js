"use strict";
import {Homepage} from "/js/modules/homepage.js";

window.addEventListener("load", function () {
    const build = 56;
    (new Homepage(build)).run();
});
