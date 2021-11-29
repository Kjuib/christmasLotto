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
        const eleGiftBox = window.document.getElementById('nEmployeeList');

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

    async function checkNext() {
        // state.employeeStack = await getNextEmployees();

        const eleEmployeeBox = window.document.getElementById('nEmployeeList');

        for (let i = 0; i < 5; i++) {
            const employee = state.employeeStack[i];

            if (eleEmployeeBox.children[i] && eleEmployeeBox.children[i].id !== employee.id) {
                eleEmployeeBox.children[i].classList.add('hidden');
                await sleep(500);
                eleEmployeeBox.removeChild(eleEmployeeBox.children[i]);
            } else if (!eleEmployeeBox.children[i]) {
                const newDiv = window.document.createElement('div');
                newDiv.classList.add('neBlock');
                newDiv.id = employee.id;
                newDiv.innerHTML = `<img src="../images/employees/${employee.image}" alt="${employee.name}" /><div class="neName">${employee.name}</div>`;

                eleEmployeeBox.append(newDiv);
            }
        }

        setTimeout(checkNext, 500);
    }

    // https://spicyyoghurt.com/tools/easing-functions
    function easeOutExpo (t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function onKeyUp(event = {}) {
        if (event.key === 'n') {
            state.employeeStack.push(state.employeeStack.shift());

            console.log('state.employeeStack', state.employeeStack);
        } else {
            console.log('event', event);
        }
    }

    async function setup() {
        window.document.addEventListener('keyup', onKeyUp, false);

        state.employeeStack = [
            { id: 'e001', name: 'Jim Jimmerson', image: 'e001.png' },
            { id: 'e002', name: 'Jon Johnson', image: 'e002.png' },
            { id: 'e003', name: 'Susan Saltwagon', image: 'e003.png' },
            { id: 'e004', name: 'Old Hugh', image: 'e004.png' },
            { id: 'e005', name: 'Jane Smitherton', image: 'e005.png' },
            { id: 'e006', name: 'Sam Samsonite', image: 'e006.png' },
        ];

        await checkNext();
    }

    await setup();
})();
