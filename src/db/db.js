import fs from 'fs';
import _ from 'lodash';
import { list as employeeListSource } from './employees.js';
import { list as giftListSource } from './gifts.js';

const dbRoot = './current';
const employeeFile = `${dbRoot}/employeeList.json`;
const giftFile = `${dbRoot}/giftList.json`;

async function readJsonFile(filename) {
    const contents = await fs.readFileSync(filename);
    return JSON.parse(contents);
}

export async function getNextEmployees() {
    const employeeList = await readJsonFile(employeeFile);

    const filteredEmployeeList = _.filter(employeeList, { complete: false });

    const nextEmployeeList = _.slice(filteredEmployeeList, 0, 5);

    return nextEmployeeList;
}

export async function getNextGifts() {
    const giftList = await readJsonFile(giftFile);

    const filteredGiftList = _.filter(giftList, { complete: false });

    const nextGiftList = _.slice(filteredGiftList, 0, 3);

    return nextGiftList;
}

export async function giveGift(body = {}) {
    const employeeId = body.employeeId;
    if (!employeeId) {
        throw 'missing required fields: employeeId';
    }

    const giftId = body.giftId;
    if (!giftId) {
        throw 'missing required fields: giftId';
    }
    const employeeList = await readJsonFile(employeeFile);
    const giftList = await readJsonFile(giftFile);

    const employee = _.find(employeeList, { id: employeeId });
    if (!employee) {
        throw 'invalid employeeId';
    }

    const gift = _.find(giftList, { id: giftId });
    if (!gift) {
        throw 'invalid giftId';
    }

    gift.employeeId = employee.id;
    gift.complete = true;
    employee.gift = gift;
    employee.complete = true;

    await fs.writeFileSync(employeeFile, JSON.stringify(employeeList, null, 2));
    await fs.writeFileSync(giftFile, JSON.stringify(giftList, null, 2));
}

export async function reset() {
    if (fs.existsSync(dbRoot)) {
        await fs.rmSync(employeeFile, { force: true });
        await fs.rmSync(giftFile, { force: true });
        await fs.rmdirSync(dbRoot);
    }

    await fs.mkdirSync(dbRoot);

    const resetEmployeeList = _.map(employeeListSource, (employee) => {
        employee.complete = false;
        employee.gift = null;

        return employee;
    });

    const shuffledEmployeeList = _.shuffle(resetEmployeeList);

    await fs.writeFileSync(employeeFile, JSON.stringify(shuffledEmployeeList, null, 2));

    const resetGiftList = _.map(giftListSource, (gift) => {
        gift.complete = false;
        gift.employeeId = null;

        return gift;
    });

    const shuffledGiftList = _.shuffle(resetGiftList);

    await fs.writeFileSync(giftFile, JSON.stringify(shuffledGiftList, null, 2));

    console.log('\n==============================\n');
    console.log('reset complete');
}
