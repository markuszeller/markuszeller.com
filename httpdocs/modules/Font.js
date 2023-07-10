"use strict";

export class Font {
    #map              = {};
    #width            = 10;
    #spacing          = 2;
    #height           = 34;
    #charsPerRow      = 8;
    #maxChars         = 41;
    #yOffset          = 41;
    #spawn= {x: 256, y: -this.#height};
    #portalY          = 555;
    #portalAlpha      = 0;
    #isPortalIn       = false;
    #isPortalOut      = false;
    #containers       = [];
    #containerLetters = [];
    #containerIndex = -1;
    #portalLetters    = [];
    #portalVelocity   = 0;
    #portalSpeed      = 2;
    #isLeftToRight    = true;
    #waitTime         = 200;
    #scene;
    #xBound;
    #containerHeight;
    #remainingWaitTime;

    constructor(scene) {
        this.#scene           = scene;
        this.#xBound          = this.#scene.canvas.width - this.#width;
        this.#containerHeight = this.#height * 4 + 4;
        this.#generateMap();
        this.#addHandlers();
    }

    #generateMap() {
        "abcdefghijklmnopqrstuvwxyz!'()-.?:0123456789,".split("")
            .forEach((char, i) => {
                this.#map[char] = {
                    x: i * this.#width % (this.#charsPerRow * this.#width),
                    y: (i / this.#charsPerRow | 0) * this.#height + this.#yOffset
                };
            });
    }

    #addHandlers() {
        [...document.querySelectorAll('section a')].map(portal => {
            portal.addEventListener('mouseover', (e) => this.setPortalText(e.target.title));
            portal.addEventListener('mouseout', (e) => this.clearPortalText());
        });
    }

    drawChar(char, x, y) {
        if (char === " " || x > this.#xBound || x < -this.#width || y < -this.#height) {
            return;
        }
        const charData = this.#map[char];
        if (!charData) return;
        this.#scene.ctx.drawImage(this.#scene.sprite, charData.x, charData.y, this.#width, this.#height - 2, x, y, this.#width, this.#height);
    }

    #setContainerText(textArray) {
        this.#containerLetters.length = 0;
        let row= 0;
        textArray.forEach((text) => {
            const y      = row * this.#height + this.#spacing;
            let chars    = text.toLowerCase().split("");
            let x        = this.#scene.canvas.width / 2 - (chars.length * this.#width + chars.length * this.#spacing) / 2;
            chars.forEach((char, j) => {
                this.#containerLetters.push({
                    char : char,
                    dx   : x,
                    dy   : y,
                    x    : x + Math.random() * this.#width * 4 | 0,
                    y    : this.#spawn.y - Math.random() * 16 * this.#height | 0,
                });
                x += this.#width + this.#spacing;
                this.#isLeftToRight = !this.#isLeftToRight;
            });
            row++;
        });
        this.#scene.state.setTextIn();
    }

    setPortalText(title) {
        this.#portalLetters.length = 0;
        let chars                  = title.toLowerCase().split("");
        let x                      = this.#scene.canvas.width / 2 - (chars.length * this.#width + chars.length * this.#spacing) / 2;
        chars.forEach((char, j) => {
            this.#portalLetters.push({
                char: char,
                dx  : x,
                dy  : this.#portalY,
                x   : x,
                y   : this.#scene.canvas.height,
            });
            x += this.#width + this.#spacing;
        });
        this.#portalAlpha    = 255;
        this.#portalVelocity = 2;
        this.#isPortalOut    = false;
        this.#isPortalIn     = true;
    }

    clearPortalText() {
        this.#isPortalOut    = true;
        this.#portalVelocity = 1;
    }

    drawContainer() {
        this.#containerLetters.forEach((letter) => {
            if (letter.y === this.#spawn.y) {
                return;
            }
            this.drawChar(letter.char, letter.x + .5 | 0, letter.y + .5 | 0)
        });
    }

    drawPortal() {
        if (!this.#portalLetters.length) {
            return;
        }
        this.#scene.ctx.globalAlpha = this.#portalAlpha / 255;
        this.#scene.ctx.fillStyle   = "#313c39";
        const first                 = this.#portalLetters[0];
        const last                  = this.#portalLetters[this.#portalLetters.length - 1];
        this.#scene.ctx.fillRect(first.x - this.#width, first.y - 6, last.x - first.x + this.#width * 3, this.#height + 10);
        this.#portalLetters.forEach((letter) => {
            this.drawChar(letter.char, letter.x + .5 | 0, letter.y + .5 | 0)
        });
        this.#scene.ctx.globalAlpha = 1;
    }

    #updatePortalIn() {
        if (!this.#isPortalIn || !this.#portalLetters.length) {
            return;
        }
        this.#portalLetters.forEach((letter) => {
            letter.y = Math.max(letter.y - this.#portalVelocity, letter.dy);
        });
        this.#portalVelocity += this.#portalSpeed;
        if (this.#portalLetters[0].y === this.#portalLetters[0].dy) {
            this.#isPortalIn = false;
        }
    }

    #updatePortalOut() {
        if (!this.#isPortalOut) {
            return;
        }
        this.#portalAlpha -= this.#portalVelocity * 4;
        this.#portalLetters.forEach((letter) => {
            letter.y += this.#portalVelocity;
        });
        this.#portalVelocity += this.#portalSpeed;
        if (this.#portalAlpha <= 0 || this.#portalLetters[0].y > this.#scene.canvas.height) {
            this.#portalLetters.length = 0;
            this.#isPortalOut          = false;
        }
    }

    #updateContainerIn() {
        if (!this.#scene.state.isTextIn()) {
            return;
        }
        let inPlace = 0;
        this.#containerLetters.forEach((letter) => {
            letter.x += (letter.dx - letter.x) * 0.1;
            letter.y += (letter.dy - letter.y) * 0.1;
            const x = letter.x + .5 | 0;
            const y = letter.y + .5 | 0;
            inPlace += x === letter.dx && y === letter.dy ? 1 : 0;
        });
        if (inPlace === this.#containerLetters.length) {
            this.#remainingWaitTime = this.#waitTime;
            this.#scene.state.setWaiting();
        }
    }

    #updateContainerWait() {
        if (!this.#scene.state.isWaiting()) {
            return;
        }
        if (--this.#remainingWaitTime <= 0) {
            this.#scene.state.setTextOut();
            this.#containerLetters.forEach((letter) => {
                letter.dy += this.#scene.canvas.height + this.#height;
                letter.velocity = Math.random() + 0.1;
            });
        }
    }

    #updateContainerOut() {
        if (!this.#scene.state.isTextOut()) {
            return;
        }
        let inPlace = 0;
        this.#containerLetters.forEach((letter) => {
            const y = letter.y + .5 | 0;
            if (y < -this.#height) {
                inPlace++;

                return;
            }
            letter.y -= letter.velocity;
            letter.velocity *= 1.04;
            letter.x -= Math.cos(letter.y * 0.04) * 0.125;
        });
        if (inPlace === this.#containerLetters.length) {
            this.#scene.state.setReady();
        }
    }

    addContainer(lines) {
        this.#containers.push(lines);
    }

    nextContainer() {
        this.#containerIndex++;
        if (this.#containerIndex >= this.#containers.length) {
            this.#containerIndex = 0;
        }
        this.#setContainerText(this.#containers[this.#containerIndex]);
    }

    update() {
        this.#updateContainerIn();
        this.#updateContainerWait();
        this.#updateContainerOut();
        this.#updatePortalIn();
        this.#updatePortalOut();
    }
}
