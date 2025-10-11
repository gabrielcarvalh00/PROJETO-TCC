import express from "express";
import mysql from "mysql";

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'BlockChain'
});

con.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados');
});

//
const app = express();
app.use(express.json());
app.use(express.static('./public'));
app.use(express.static('./script'));


//pega o imput da imagem e insere tabele imagem;
app.post('/rota', (req, res) => {
    console.log("Chegou aqui na rota /rota");

    const { latitude, longitude , link, value, addressWallet, drone, ImageDescription} = req.body;

    if (latitude !== undefined && longitude !== undefined) {
        
        const droneManufacturer = drone;
        const a = ImageDescription;  
        let imageDescription=a;

        const sellerId = 1; 

        // CORREÇÃO: Incluindo 'value', 'link' e 'AndresWallet' na query SQL
        const sql = `
            INSERT INTO Image (description, drone_manufacturer, location_lat, location_lon, seller_id, registrationdata, value, link, AndresWallet)
            VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)
        `;

        // CORREÇÃO: Passando 'value', 'link' e 'addressWallet' (que mapeia para AndresWallet)
        con.query(sql, [ 
            imageDescription, 
            droneManufacturer, 
            latitude, 
            longitude, 
            sellerId, 
            value,        // Mapeia para o 7º '?' (value)
            link,         // Mapeia para o 8º '?' (link)
            addressWallet // Mapeia para o 9º '?' (AndresWallet)
        ], (err, result) => {
            if (err) {
                console.error('Erro ao inserir coordenadas no banco de dados:', err);
                return res.status(500).json({ message: 'Erro ao salvar coordenadas no banco de dados.' });
            }
            console.log('Coordenadas inseridas com sucesso na tabela Image! ID:', result.insertId);
            res.status(200).json({
                message: 'Dados de latitude e longitude recebidos e salvos com sucesso!',
                data: { latitude, longitude, insertedId: result.insertId }
            });
        });

    } else {
        res.status(400).json({ message: 'Dados de latitude ou longitude ausentes na requisição.' });
    }
});

//
app.get('/imagens-por-area', (req, res) => {

    const { latMin, latMax, lngMin, lngMax } = req.query;

    if (
        latMin === undefined || latMax === undefined ||
        lngMin === undefined || lngMax === undefined ||
        isNaN(parseFloat(latMin)) || isNaN(parseFloat(latMax)) ||
        isNaN(parseFloat(lngMin)) || isNaN(parseFloat(lngMax))
    ) {
        return res.status(400).json({ message: 'Parâmetros de coordenadas (latMin, latMax, lngMin, lngMax) são obrigatórios e devem ser números.' });
    }

     //pegando as latitude e longitudess=
    const minLat = parseFloat(latMin);//13
    const maxLat = parseFloat(latMax);//15
    const minLng = parseFloat(lngMin);//39
    const maxLng = parseFloat(lngMax);//41

    const sql = `
        SELECT * FROM Image
        WHERE location_lat BETWEEN ? AND ?
          AND location_lon BETWEEN ? AND ?
    `;

    con.query(sql, [minLat, maxLat, minLng, maxLng], (err, results) => {
        if (err) {
            console.error('Erro ao buscar imagens:', err);
            return res.status(500).json({ message: 'Erro no banco de dados.' });
        }

        console.log("Resultados encontrados:", results); // <-- Aqui imprime no terminal

        res.status(200).json(results);
    });
});


app.listen(3030, () => {
    console.log('Servidor rodando em http://localhost:3030');
});