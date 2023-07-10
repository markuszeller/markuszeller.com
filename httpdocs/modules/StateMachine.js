"use strict";
export class StateMachine {
    #states = {
        init    : 0,
        avatarIn: 1,
        textIn  : 2,
        waiting : 3,
        textOut : 4,
        ready: 5,
    };
    #state;

    constructor() {
        this.#state = this.#states.init;
    }

    setAvatarIn() {
        this.#state = this.#states.avatarIn;
    }

    setTextIn() {
        this.#state = this.#states.textIn;
    }

    setWaiting() {
        this.#state = this.#states.waiting;
    }

    setTextOut() {
        this.#state = this.#states.textOut;
    }

    setReady() {
        this.#state = this.#states.ready;
    }

    isInit() {
        return this.#state === this.#states.init;
    }

    isAvatarIn() {
        return this.#state === this.#states.avatarIn;
    }

    isTextIn() {
        return this.#state === this.#states.textIn;
    }

    isWaiting() {
        return this.#state === this.#states.waiting;
    }

    isTextOut() {
        return this.#state === this.#states.textOut;
    }

    isReady() {
        return this.#state === this.#states.ready;
    }
}
