const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");

export class TimeLine {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }
    // 开始
    start() {
        let startTime = Date.now();
        let t = Date.now() - startTime;
        // ???
        this[TICK] = () => {
            for(let animation of this[ANIMATIONS]) {
                let t;
                if (this[START_TIME].get(animation) < startTime) {
                    t = now - startTime;
                } else {
                    t = now - this[START_TIME].get(animation);
                }
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                animation.receive(t);
            }
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

    get rate() {}

    set rate() {}


    // 暂停
    pause() {}
    // 恢复
    resume() {}

    // 重启
    reset() {}

    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this.ANIMATIONS.add(animation);
        this.START_TIME.set(animation, startTime);
    }

    remove() {}
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
        this.object = object;
        this.property = property;
        this.tartValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }

    receive(time) {
        let range =  this.endValue - this.startValue;
        this.object[this.property] = this.startValue + range * time / this.duration;
    }
}