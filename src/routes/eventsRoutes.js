const express = require('express');
const router = express.Router();
const eventosDB = require('../data/events.json');

// Retornar todos os eventos
// GET "/eventos"
router.get('/', (req, res) =>{
    console.log("getroute");
    res.json(eventosDB);
})

// Retornar um evento especifico
// GET /eventos/1
router.get('/:id', (req, res) => {
    const id = req.params.id
    var evento = eventosDB[id]
    if(!evento) return res.status(404).json({
        "erro": "Evento não encontrado"
    })
    res.json(evento)
})

// Retornar uma data especifica
//GET /eventos/data/2024-09-19
router.get('/data/:date', (req, res) => {
    const data = req.params.date;
    const evento = eventosDB.find(event => event.date === data);
    if (!evento) {
        return res.status(404).json({ "erro": "Data não encontrada" });
    }
    res.json(evento);
});

// Retornar uma data especifica
router.get('/data/:date', (req, res) => {
    const data = req.params.date;
    const evento = eventosDB.find(event => event.date === data);
    if (!evento) {
        return res.status(404).json({ "erro": "Data não encontrada" });
    }
    res.json(evento);
});

// Retornar uma data especifica
router.get('/data/:date', (req, res) => {
    const data = req.params.date;
    const evento = eventosDB.find(event => event.date === data);
    if (!evento) {
        return res.status(404).json({ "erro": "Data não encontrada" });
    }
    res.json(evento);
});

// Inserir um novo evento
// POST "/eventos" BODY { "id": "h7r9k2j5w4v8q0b1", "title": "Atividades Recreativas - Diversão e Movimento: Esportes Adaptados", "comments": "Organização: Comitê Paralímpico Catarinense", "description": "Evento que promove competições e atividades recreativas adaptadas, como esportes paralímpicos e jogos inclusivos. Focado em promover a atividade física e a diversão para todos", "location": "Ginásio Municipal de Criciúma, Criciúma - SC", "date": "2024-09-19", "time":  "13:30:00"}
router.post('/', (req, res) => {
    const evento = req.body
    console.log(evento);
    if(!evento.id) return res.status(400).json({
        "erro": "Evento precisa ter um 'id'"
    })
    if(!evento.title) return res.status(400).json({
        "erro": "Evento precisa ter um 'título'"
    })
    if(!evento.comments) return res.status(400).json({
        "erro": "Evento precisa ter pelo menos um 'comentário'"
    })
    if(!evento.description) return res.status(400).json({
        "erro": "Evento precisa ter uma 'descrição'"
    })
    if(!evento.location) return res.status(400).json({
        "erro": "Evento precisa ter uma 'localização'"
    })
    if(!evento.date) return res.status(400).json({
        "erro": "Evento precisa ter uma 'data'"
    })
    eventosDB.push(evento)
    return res.json(evento)
})

// Substituir um evento
// PUT "/eventos/2" BODY { "id": "n3p6f1x9m2z4l8r7", "title": "Palestra - "Inteligência Artificial: Desafios e Oportunidades"", "comments": "Apresentantes: Gabriela Santos, Cientista de Dados e Especialista em IA e Rafael Oliveira, Engenheiro de Inteligência Artificial", "description": "Esta palestra abordará os aspectos fundamentais da Inteligência Artificial (IA), explorando tanto os desafios quanto as oportunidades que essa tecnologia emergente oferece", "location": "Auditório Ruy Hulse - UNESC, Criciúma - SC", "date": "2024-09-09", "time":  "20:00:00"}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const novoEvento = req.body
    const atualEvento = eventosDB[id]
    if(!atualEvento) 
        return res.status(404).json({
        "erro": "Evento não encontrado"
    })

    if(!novoEvento.id) return res.status(400).json({
        "erro": "Evento precisa ter um 'id'"
    })
    if(!novoEvento.title) return res.status(400).json({
        "erro": "Evento precisa ter um 'título'"
    })
    if(!novoEvento.comments) return res.status(400).json({
        "erro": "Evento precisa ter pelo menos um 'comentário'"
    })
    if(!novoEvento.description) return res.status(400).json({
        "erro": "Evento precisa ter uma 'descrição'"
    })
    if(!novoEvento.location) return res.status(400).json({
        "erro": "Evento precisa ter uma 'localização'"
    })
    if(!novoEvento.date) return res.status(400).json({
        "erro": "Evento precisa ter uma 'data'"
    })

    eventosDB[id] = novoEvento
    return res.json(novoEvento)
})

// Deletar um evento
// DELETE "/eventos/0"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    const evento = eventosDB[id]
    if(!evento) return res.status(404).json({
        "erro": "Evento não encontrado"
    })
    var deletado = eventosDB.splice(id, 1)
    res.json(deletado)
})

module.exports = router
