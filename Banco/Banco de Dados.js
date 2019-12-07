"use strict";
// importação de dependencia
var mysql = require("mysql");
// conectando com o banco mysql 
var connect = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'trabalho topicos'
});
// testando a conexão com o banco
connect.connect(function (err) {
    if (err)
        return console.log(err);
    console.log('connectou');
});
module.exports = connect;
