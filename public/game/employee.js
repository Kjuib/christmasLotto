'use strict';
(async function() {
    const state = {};

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

    // https://spicyyoghurt.com/tools/easing-functions
    function easeOutExpo (t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function setup() {
        state.employeeStack = [
            { id: 'e001', name: 'Jim Jimmerson', image: 'e001.png' },
            { id: 'e002', name: 'Jon Johnson', image: 'e002.png' },
            { id: 'e003', name: 'Susan Saltwagon', image: 'e003.jpg' },
            { id: 'e004', name: 'Old Hugh', image: 'e004.jpg' },
            { id: 'e005', name: 'Jane Smitherton', image: 'e005.jpg' },
            { id: 'e006', name: 'Sam Samsonite', image: 'e006.jpg' },
        ];
    }

    await setup();
})();
