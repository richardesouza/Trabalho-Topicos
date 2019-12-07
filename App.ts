// importação de dependencias.
import * as express from 'express'
import * as handlebars from 'express-handlebars'
import * as bd from './models/banco'
import * as bodyParser from 'body-parser'
const app = express()


// configuração do templete engine.
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// configurando o body-parser.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// rota para a tabela aluno.
app.get('/', (req: any, res: any) => {
    bd.query("SELECT * FROM alunos", (err, result, fields) => {
        res.render('alunos', { aluno: JSON.stringify(result, null, 3) })
    })
})



// retorna uma lista de alunos e materia.
app.get('/matricular', (req: any, res: any) => {
    bd.query("SELECT * FROM alunos", (err, result, fields) => {
        bd.query("SELECT * FROM materia", (er, resu, fie) => {
            res.render('matricular', { aluno: result, materia: resu })
        })
    })
})

// caminho para a pagina que lista em json os alunos.
app.get('/disciplinas', (req: any, res: any) => {
    bd.query("SELECT * FROM materia", (err, result, fields) => {
        res.render('disciplinas', { materias: JSON.stringify(result, null, 3) })
    })
})

// caminho para a pagina que lista os alunos matriculados.
app.get('/lista_matricula', (req: any, res: any) => {
    bd.query(`SELECT a.matricula as Matricula, a.Nome as Nome, a.Sobrenome as Sobrenome, d.nome as Materia, d.cod as Codigo_Materia FROM alunos as a
    inner join matricula as m on m.alunos_matricula = a.matricula
    inner join materia as d on m.materia_cod = d.cod`, (err: any, result: any, fields: any) => {
        res.render('lista_matricula', { aluno: JSON.stringify(result, null, 3) })
    })
})

// caminho para a pagina de cadastro de alunos.
app.get('/cadastro', (req: any, res: any) => {
    res.render('cadastro')
})

// caminho para a pagina de cadastro de materia/disciplina.
app.get('/cadastro_materia', (req: any, res: any) => {
    res.render('cadastrar_materia')
})

// cadastro de aluno.
app.post('/addAluno', (req: any, res: any) => {
    bd.query("INSERT INTO alunos(nome,sobrenome) VALUES (?)", [
        [req.body.nome, req.body.sobrenome]
    ], (error: any, results: any, fields: any) => {
        if (error) {
            res.send(error)
        } else {
            res.send(JSON.stringify({
                "Nome": req.body.nome,
                "Sobrenome": req.body.sobrenome
            }, null, 3))
        }
    })
})

// cadastro de materia/disciplina.
app.post('/cadastro_materia', (req: any, res: any) => {
    bd.query("INSERT INTO materia(nome) VALUES (?)", [
        [req.body.nome]
    ], (error: any, results: any, fields: any) => {
        if (error) {
            res.send(error)
        } else {
            res.send(JSON.stringify({
                "Nome": req.body.nome
            }, null, 3))
        }
    })
})

// matricula o aluno em uma disciplina.
app.post('/adddisciplina', (req: any, res: any) => {
    bd.query("INSERT INTO matricula(alunos_matricula,materia_cod) VALUES (?) ", [
        [req.body.aluno, req.body.materia]
    ], (error: any, results: any, fields: any) => {
        if (error) {
            res.send(error)
        } else {
            res.send(JSON.stringify({
                "alunos_matricula": req.body.aluno,
                "materia_cod": req.body.materia
            }, null, 3))
        }
    })
})

// ativa o servidor. 
app.listen(3001, () => {
    console.log('Servidor ligado na port 3001');
})

app.listen(3002, () => {
    console.log('Servidor ligado na port 3002');
})