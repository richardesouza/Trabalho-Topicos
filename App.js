"use strict";
exports.__esModule = true;

// importação de dependencias
var express = require("express");
var handlebars = require("express-handlebars");
var bd = require("./models/banco");
var bodyParser = require("body-parser");
var app = express();

// configuração do templete engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// configurando o body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// rota para a tabela aluno 
app.get('/', function (req, res) {
    bd.query("SELECT * FROM alunos", function (err, result, fields) {
        res.render('alunos', { aluno: JSON.stringify(result, null, 3) });
    });
});

// retorna uma lista de alunos e materia
app.get('/matricular', function (req, res) {
    bd.query("SELECT * FROM alunos", function (err, result, fields) {
        bd.query("SELECT * FROM materia", function (er, resu, fie) {
            res.render('matricular', { aluno: result, materia: resu });
        });
    });
});

// caminho para a pagina que lista em json os alunos 
app.get('/disciplinas', function (req, res) {
    bd.query("SELECT * FROM materia", function (err, result, fields) {
        res.render('disciplinas', { materias: JSON.stringify(result, null, 3) });
    });
});

// caminho para a pagina que lista os alunos matriculados
app.get('/lista_matricula', function (req, res) {
    bd.query("SELECT a.matricula as Matricula, a.Nome as Nome, a.Sobrenome as Sobrenome, d.nome as Materia, d.cod as Codigo_Materia FROM alunos as a\n    inner join matricula as m on m.alunos_matricula = a.matricula\n    inner join materia as d on m.materia_cod = d.cod", function (err, result, fields) {
        res.render('lista_matricula', { aluno: JSON.stringify(result, null, 3) });
    });
});

// caminho para a pagina de cadastro de alunos
app.get('/cadastro', function (req, res) {
    res.render('cadastro');
});

// caminho para a pagina de cadastro de materia/disciplina 
app.get('/cadastro_materia', function (req, res) {
    res.render('cadastrar_materia');
});

// cadastro de aluno
app.post('/addAluno', function (req, res) {
    bd.query("INSERT INTO alunos(nome,sobrenome) VALUES (?)", [
        [req.body.nome, req.body.sobrenome]
    ], function (error, results, fields) {
        if (error) {
            res.send(error);
        }
        else {
            res.send(JSON.stringify({
                "Nome": req.body.nome,
                "Sobrenome": req.body.sobrenome
            }, null, 3));
        }
    });
});

// cadastro de materia/disciplina
app.post('/cadastro_materia', function (req, res) {
    bd.query("INSERT INTO materia(nome) VALUES (?)", [
        [req.body.nome]
    ], function (error, results, fields) {
        if (error) {
            res.send(error);
        }
        else {
            res.send(JSON.stringify({
                "Nome": req.body.nome
            }, null, 3));
        }
    });
});

// matricula o aluno em uma disciplina
app.post('/adddisciplina', function (req, res) {
    bd.query("INSERT INTO matricula(alunos_matricula,materia_cod) VALUES (?) ", [
        [req.body.aluno, req.body.materia]
    ], function (error, results, fields) {
        if (error) {
            res.send(error);
        }
        else {
            res.send(JSON.stringify({
                "alunos_matricula": req.body.aluno,
                "materia_cod": req.body.materia
            }, null, 3));
        }
    });
});

// ativa o servidor 
app.listen(3001, function () {
    console.log('Servidor ligado na port 3001');
});
app.listen(3002, function () {
    console.log('Servidor ligado na port 3002');
});
