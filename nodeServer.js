const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const parse = (csvString) => {
    const parsedCsv = csvString
    .toString()
    .split('\n')
    .map(e => e.trim())
    .map(e => e.split(',').map(e => e.trim()))[0];
    return parsedCsv[parsedCsv.length - 2];
};
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
const port = 4200;
const {
    writeFile,
    readFile
} = require('fs').promises;
const app = express();

app.use(express.static(__dirname + '/DB'));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json());

app.get('/load', async (req, res) => {
    console.log('LOAD');
    try {
        const data = await readFile('./calculatorDataBase.txt', {
            encoding: 'utf8',
        });
        return res.status(200).json({ result: parse(data) });
    } catch (err) {
        return res.status(500);
    }
});

app.post('/save', async (req,res) => {
    console.log('SAVE');
    const {
        numToSave
    } = req.body;
    try {
        const content = numToSave + ',';
        await writeFile('./calculatorDataBase.txt', content, { flag: 'a+' });
        return res.status(200).json({});
    } catch (err) {
        return res.status(500);
    }
});

app.listen(port, () => console.log(`Running on localhost:${port}`));