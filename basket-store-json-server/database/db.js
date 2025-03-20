const fs = require('fs');
const path = require('path');

// Caminho para o arquivo db.json
const dbPath = path.join(__dirname, 'db.json');

// Função para obter os dados
function getDb() {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
}

// Função para salvar os dados no db.json
function saveDb(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { getDb, saveDb };