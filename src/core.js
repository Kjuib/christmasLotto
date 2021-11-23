import express from 'express';
import bodyParser from 'body-parser';
import * as db from './db/db.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use('/images', express.static('public/images'))
app.use('/game', express.static('public/game'))

app.post('/reset', async (req, res) => {
    await db.reset();
    
    res.send('reset complete')
});

app.get('/nextEmployees', async (req, res) => {
    const nextEmployees = await db.getNextEmployees();

    res.set('Content-Type', 'application/json')
    res.send(JSON.stringify(nextEmployees));
});

app.get('/nextGifts', async (req, res) => {
    const nextGifts = await db.getNextGifts();

    res.set('Content-Type', 'application/json')
    res.send(JSON.stringify(nextGifts));
});

app.post('/giveGift', async (req, res) => {
    try {
        const body = req.body;
        await db.giveGift(body);
        res.send('gift given');
    } catch (e) {
        console.log('error 667', e);
        res.status(400).send('error 667')
    }
});

app.post('/undo', async (req, res) => {
    await db.undo();

    res.send('undo complete')
});

app.post('/skip', async (req, res) => {
    await db.skip();

    res.send('skip complete')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
