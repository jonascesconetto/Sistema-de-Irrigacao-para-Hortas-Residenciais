const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
var pg = require('pg');
const cors = require('cors');

const config = {
    user: 'postgres',
    database: 'hortasResidenciaisDB',
    password: '1234',
    port: 5432
};

const pool = new pg.Pool(config);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, './public/html')
    })
});

app.get('/relatorio', (req, res) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('select * from public.\"controleIrrigacao\"', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        })
    })
});

app.get('/insere', (req, res) => {
    pool.connect(function (err, client, done) {
        var d = new Date();
        
        var datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " +
            d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        
            let info_01 = req.query.temperatura;
            let info_02 = req.query.umidade1
            let info_03 = req.query.umidade2
            let info_04 = req.query.nivelReservatorio;

            //console.log(req.query);
            
            ///insere?temperatura=10&umidade1=10&umidade2=10&nivelReservatorio=OK
            let query = "insert into public.\"controleIrrigacao\" (temperatura_ambiente, umidade_sensor_1, umidade_sensor_2, nivel_reservatorio, data) values (" + info_01 + "," + info_02 + "," + info_03 + ",'" + info_04 + "','" + datestring + "');";        
        if (err) {
            console.log("Erro ao conectar ao banco de dados." + err);
        }
        client.query(query, function (err, result) {
            done();
            if (err) {
                console.log(err);                
            }
            res.status(200).send("Inserido");
        })
    })   
});

app.listen(3000, () => console.log('Listening on port 3000!!!'));