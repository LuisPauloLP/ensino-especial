const express = require('express');
const router = express.Router();
const estudantesDB = require('../data/students.json');

// Retornar todos os estudantes
// GET "/estudantes"
router.get('/', (req, res) =>{
    console.log("getroute");
    res.json(estudantesDB);
})

// Retornar um estudante especifico
// GET /estudantes/1
router.get('/:id', (req, res) => {
    const id = req.params.id
    var estudante = estudantesDB[id]
    if(!estudante) return res.status(404).json({
        "erro": "estudante não encontrado"
    })
    res.json(estudante)
})

// Retornar uma turma especifica
//GET /estudante/class
router.get('/turma/:class', (req, res) => {
    const turma = req.params.class;
    const estudante = estudantesDB.find(student => student.class === turma);
    if (!estudante) {
        return res.status(404).json({ "erro": "turma não encontrada" });
    }
    res.json(estudante);
});


// Inserir um novo estudante
// POST "/estudantes" BODY { "id": "h7r9k2j5w4", "name": "giuberto", "age": "24", "class": "2", "course": "Direito", "parents": "jouel e heby", "phone_number":  "48 7394 3566",  "address": "rua Gabriel Asevado",  "special_needs": "autismo",  "status": "on"}
router.post('/', (req, res) => {
    const estudante = req.body
    console.log(estudante);
    if(!estudante.id) return res.status(400).json({
        "erro": "estudante precisa ter um 'id'"
    })
    if(!estudante.name) return res.status(400).json({
        "erro": "estudante precisa ter um 'nome'"
    })
    if(!estudante.age) return res.status(400).json({
        "erro": "estudante precisa ter uma 'idade'"
    })
    if(!estudante.class) return res.status(400).json({
        "erro": "estudante precisa ter uma 'turma'"
    })
    if(!estudante.course) return res.status(400).json({
        "erro": "estudante precisa ter um 'curso'"
    })
    if(!estudante.perents) return res.status(400).json({
        "erro": "estudante precisa ter algum 'parente'"
    })
    if(!estudante.phone_number) return res.status(400).json({
        "erro": "estudante precisa ter um 'numero de telefone'"
    })
    if(!estudante.address) return res.status(400).json({
        "erro": "estudante precisa ter um 'endereco'"
    })
    if(!estudante.special_needs) return res.status(400).json({
        "erro": "estudante precisa ter uma 'necessidade especial'"
    })
    if(!estudante.status) return res.status(400).json({
        "erro": "estudante precisa ter um 'status'"
    })
    
    estudantesDB.push(estudante)
    return res.json(estudante)
})

// Substituir um evento
// PUT "/estudantes/2" BODY { "id": "h7r9k2j5w4", "name": "giuberto", "age": "24", "class": "2", "course": "Direito", "parents": "jouel e heby", "phone_number":  "48 7394 3566",  "address": "rua Gabriel Asevado",  "special_needs": "autismo",  "status": "on",}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const novoEstudante = req.body
    const atualEstudante = estudantesDB[id]
    if(!atualEstudante) 
        return res.status(404).json({
        "erro": "Estudante não encontrado"
    })

    if(!estudante.id) return res.status(400).json({
        "erro": "estudante precisa ter um 'id'"
    })
    if(!estudante.name) return res.status(400).json({
        "erro": "estudante precisa ter um 'nome'"
    })
    if(!estudante.age) return res.status(400).json({
        "erro": "estudante precisa ter uma 'idade'"
    })
    if(!estudante.class) return res.status(400).json({
        "erro": "estudante precisa ter uma 'turma'"
    })
    if(!estudante.course) return res.status(400).json({
        "erro": "estudante precisa ter um 'curso'"
    })
    if(!estudante.perents) return res.status(400).json({
        "erro": "estudante precisa ter algum 'parente'"
    })
    if(!estudante.phone_number) return res.status(400).json({
        "erro": "estudante precisa ter um 'numero de telefone'"
    })
    if(!estudante.address) return res.status(400).json({
        "erro": "estudante precisa ter um 'endereco'"
    })
    if(!estudante.special_needs) return res.status(400).json({
        "erro": "estudante precisa ter uma 'necessidade especial'"
    })
    if(!estudante.status) return res.status(400).json({
        "erro": "estudante precisa ter um 'status'"
    })

    estudantesDB[id] = novoEstudante
    return res.json(novoEstudante)
})

// Deletar um estudante
// DELETE "/estudantes/0"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    const estudante = estudantesDB[id]
    if(!estudante) return res.status(404).json({
        "erro": "estudante não encontrado"
    })
    var deletado = estudantesDB.splice(id, 1)
    res.json(deletado)
})

module.exports = router