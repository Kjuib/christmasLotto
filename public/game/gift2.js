'use strict';
(async function() {
    const state = {};

    async function addSpinPauseBlank(parent) {
        const blank1 = window.document.createElement('div');
        blank1.classList.add('ngBlock', 'ngBlank');
        blank1.style.transition = `all 250ms`;
        parent.prepend(blank1);
        keepClear(parent);

        await sleep(250);
    }

    async function spinPause() {
        state.isSpinning = true;
        const eleGiftBox = window.document.getElementById('nGiftList');

        await addSpinPauseBlank(eleGiftBox);
        await addSpinPauseBlank(eleGiftBox);

        const eleSpin = window.document.createElement('div');
        eleSpin.classList.add('ngBlock', 'ngSpin');
        eleSpin.style.transition = `all 250ms`;
        eleSpin.innerHTML = '<div class="ngSpinPulse">!!! spin !!!</div>';
        eleGiftBox.prepend(eleSpin);
        keepClear(eleGiftBox);
        await sleep(250);

        await addSpinPauseBlank(eleGiftBox);
        await addSpinPauseBlank(eleGiftBox);

        state.isSpinning = false;
        state.needToSpin = true;
    }

    function spinPartB(eleParent, speed) {
        const nextGift = state.giftStack.shift();
        state.giftStack.push(nextGift);

        const newDiv = window.document.createElement('div');
        newDiv.classList.add('ngBlock');
        newDiv.id = nextGift.id;
        newDiv.style.transition = `all ${speed}ms`;
        newDiv.innerHTML = `<img src="../images/gifts/${nextGift.image}" alt="${nextGift.name}" /><div class="ngName">${nextGift.name}</div>`;
        newDiv.addEventListener('click', (event) => {
            let target = event.target;
            if (!target.id) {
                target = target.parentElement;
            }
            
            giveGift(target.id);
        });

        eleParent.prepend(newDiv);
        keepClear(eleParent);
    }

    function spinPartA(spinState) {
        const eleGiftBox = window.document.getElementById('nGiftList');

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
                spinPartA(spinState);
            }, spinSpeed);
        } else {
            state.isSpinning = false;
            state.giftSelected = false;
        }
    }

    async function giveGift(giftId) {
        if (state.isSpinning || state.needToSpin || state.giftSelected) {
            console.log('STILL SPINNING', '002', state, giftId);
            return;
        }

        state.giftSelected = true;

        const eleGift = window.document.getElementById(giftId);
        eleGift.style.left = '100%';
        eleGift.style.opacity = '0';

        const eleLastGift = window.document.getElementById('lastGift');
        eleLastGift.classList.add('hidden');

        await sleep(250);

        const employee = {
            id: 'e001',
            name: 'Susan Saltwagon',
            image: 'e001.png'
        }

        const gift = _.find(state.giftStack, { id: giftId });

        eleLastGift.innerHTML = `<img src="../images/employees/${employee.image}" alt="${employee.name}" /><div class="employeeName">${employee.name}</div><div class="giftName">${gift.name}</div>`;

        await sleep(250);

        eleLastGift.classList.remove('hidden');

        await sleep(250);

        await spinPause();
    }

    // https://spicyyoghurt.com/tools/easing-functions
    function easeOutExpo (t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function keepClear(parent) {
        while (parent.children.length > 5) {
            parent.removeChild(parent.lastChild);
        }
    }

    function onKeyUp(event = {}) {
        if (state.isSpinning) {
            console.log('STILL SPINNING', '001', state, event);
        } else if (state.needToSpin && ['1', '2', '3'].includes(event.key)) {
            state.isSpinning = true;
            state.needToSpin = false;
            state.spinState = {};
            state.spinState.count = 0;
            state.spinState.halfWay = 0;
            state.spinState.max = _.random(25, 40);

            spinPartA(state.spinState);
        } else if (event.key === '1') {
            const eleGiftBox = window.document.getElementById('nGiftList');
            const giftNode = eleGiftBox.children[1];
            giveGift(giftNode.id);
        } else if (event.key === '2') {
            const eleGiftBox = window.document.getElementById('nGiftList');
            const giftNode = eleGiftBox.children[2];
            giveGift(giftNode.id);
        } else if (event.key === '3') {
            const eleGiftBox = window.document.getElementById('nGiftList');
            const giftNode = eleGiftBox.children[3];
            giveGift(giftNode.id);
        } else {
            console.log('event', event);
        }
    }

    async function setup() {
        window.document.addEventListener('keyup', onKeyUp, false);

        state.giftStack = [
            { id: 'g001', name: 'Samsung 60" QLED 4K TV', image: 'tv001.jpg' },
            { id: 'g002', name: 'A REALLY big Lego set that will take a lot of space to build', image: 'lego001.jpg' },
            { id: 'g003', name: 'Nintendo Switch 32GB', image: 'switch001.jpg' },
            { id: 'g004', name: '2x Samsung 60" QLED 4K TV', image: 'tv001.jpg' },
            { id: 'g005', name: '2x A REALLY big Lego set that will take a lot of space to build', image: 'lego001.jpg' },
            { id: 'g006', name: '2x Nintendo Switch 32GB', image: 'switch001.jpg' },
        ];

        await spinPause();
    }

    await setup();
})();
