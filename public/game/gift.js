'use strict';
(function() {
    const state = {};

    function spinPartB(eleParent, speed) {
        const nextGift = state.giftStack.shift();
        state.giftStack.push(nextGift);

        const newDiv = window.document.createElement('div');
        newDiv.classList.add('ngBlock');
        newDiv.id = nextGift.id;
        newDiv.style.transition = `all ${speed}ms`;
        newDiv.innerHTML = `<img src="../images/gifts/${nextGift.image}" alt="tv" /><div class="ngName">${nextGift.name}</div>`;

        eleParent.prepend(newDiv);

        if (eleParent.children.length > 3) {
            eleParent.removeChild(eleParent.lastChild);
        }
    }

    function spinPartA(label, spinState) {
        const eleGiftBox = window.document.getElementById(`nGift${label}`);

        if (spinState.count < spinState.max) {
            const spinTime = spinState.count / spinState.max;
            const peek = .7;

            let spinSpeed;

            if (spinTime < peek) {
                spinSpeed = (250 * (1 - easeOutExpo(spinState.count, 0, 1, spinState.max * peek))) + 100;
            } else {
                spinState.halfWay = spinState.halfWay || spinState.count;
                spinSpeed = (250 * (easeOutExpo(spinState.count - spinState.halfWay, 0, 1, spinState.max - spinState.halfWay))) + 200;
            }

            spinPartB(eleGiftBox, spinSpeed);
            spinState.count++;
            setTimeout(() => {
                spinPartA(label, spinState);
            }, spinSpeed);
        }
    }

    // https://spicyyoghurt.com/tools/easing-functions
    function easeOutExpo (t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }

    function onKeyUp(event = {}) {
        if (event.key === '1') {
            state.spin001 = {};
            state.spin001.count = 0;
            state.spin001.halfWay = 0;
            state.spin001.max = _.random(25, 40);

            // const m = (state.spin001.max - 2) % state.giftStack.length;
            // const giftGuess = state.giftStack[m];
            // console.log(m, giftGuess);

            spinPartA('001', state.spin001);
        } else if (event.key === '2') {
            state.spin002 = {};
            state.spin002.count = 0;
            state.spin002.halfWay = 0;
            state.spin002.max = _.random(25, 40);
            spinPartA('002', state.spin002);
        } else if (event.key === '3') {
            state.spin003 = {};
            state.spin003.count = 0;
            state.spin003.halfWay = 0;
            state.spin003.max = _.random(25, 40);
            spinPartA('003', state.spin003);
        } else {
            console.log('event', event);
        }
    }

    function setup() {
        window.document.addEventListener('keyup', onKeyUp, false);

        state.giftStack = [
            { id: 'g001', name: 'Samsung 60" QLED 4K TV', image: 'tv001.jpg' },
            { id: 'g002', name: 'A REALLY big Lego set that will take a lot of space to build', image: 'lego001.jpg' },
            { id: 'g003', name: 'Nintendo Switch 32GB', image: 'switch001.jpg' },
            { id: 'g004', name: '2x Samsung 60" QLED 4K TV', image: 'tv001.jpg' },
            { id: 'g005', name: '2x A REALLY big Lego set that will take a lot of space to build', image: 'lego001.jpg' },
            { id: 'g006', name: '2x Nintendo Switch 32GB', image: 'switch001.jpg' },
        ]
    }

    setup();
})();
