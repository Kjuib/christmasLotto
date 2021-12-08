'use strict';
(async function() {
    const state = {};

    async function getNextEmployees() {
        const responseRaw = await fetch('/nextEmployees');

        return await responseRaw.json();
    }

    function generateEmployeeBlock(employee) {
        return `<img src="../images/employees/${employee.image}" alt="${employee.name}" /><div><div class="neName">${employee.name}</div><div class="neDepartment">${employee.department}</div></div>`;
    }

    async function checkNext() {
        state.employeeStack = await getNextEmployees();

        const eleEmployeeBox = window.document.getElementById('nEmployeeList');

        for (let i = 0; i < 6; i++) {
            const employee = state.employeeStack[i];

            if (!employee) {
                // ignore, we are getting close to done :)
            } else if (eleEmployeeBox.children[i] && eleEmployeeBox.children[i].id !== employee.id) {
                if (eleEmployeeBox.children[i + 1] && eleEmployeeBox.children[i + 1].id === employee.id) {
                    eleEmployeeBox.children[i].classList.add('hidden');
                    await sleep(500);
                    eleEmployeeBox.removeChild(eleEmployeeBox.children[i]);
                } else {
                    const newDiv = window.document.createElement('div');
                    newDiv.classList.add('neBlock');
                    newDiv.id = employee.id;
                    newDiv.innerHTML = generateEmployeeBlock(employee);

                    eleEmployeeBox.prepend(newDiv);
                }
            } else if (!eleEmployeeBox.children[i]) {
                const newDiv = window.document.createElement('div');
                newDiv.classList.add('neBlock');
                newDiv.id = employee.id;
                newDiv.innerHTML = generateEmployeeBlock(employee);

                eleEmployeeBox.append(newDiv);
            }
        }

        while (eleEmployeeBox.children[6]) {
            eleEmployeeBox.removeChild(eleEmployeeBox.children[6]);
        }

        setTimeout(checkNext, 1000);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function setup() {
        await checkNext();
    }

    await setup();
})();
