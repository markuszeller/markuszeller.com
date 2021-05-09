"use strict";
import {Homepage} from "/js/modules/homepage.js";

addEventListener("load", function () {
    const build = 56;
    (new Homepage(build)).run();
});
