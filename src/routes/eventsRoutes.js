const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var eventsDB = loadEvents();

// Função que carrega os eventos a partir do arquivo JSON
function loadEvents() {  
    try {
      return JSON.parse(fs.readFileSync('./db/events.json', 'utf8'));
    } catch (err) {
      return [];
    }
  }
// Função para salvar os eventos no arquivo JSON
function saveEvents() {
    try {
      fs.writeFileSync('./db/events.json', JSON.stringify(eventsDB, null, 2));
      return "Saved"
    } catch (err) {
      return "Not saved";
    }
  }

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - date
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadastro do evento
 *         title:
 *           type: string
 *           description: Nome do Evento
 *         date:
 *           type: date
 *           description: Data do Evento
 *         location:
 *           type: string
 *           description: Local do Evento
 *       example:
 *         id: "c6b3a3a2p4l2r6x1"
 *         title: Palestra - Transformando o Ensino Especial para Todos
 *         date: "2024-09-10"
 *         location: Auditório Ruy Hulse - UNESC, Criciúma - SC
 */

 /**
  * @swagger
  * tags:
  *   name: Events
  *   description: 
  *     API de Controle de Eventos
  *     **Por Luís Augusto Paulo**
  */

 /**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna uma lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

// GET "/events"
router.get('/', (req, res) =>{
    console.log("getroute");
    studentsDB = loadEvents();
    res.json(eventsDB);
})

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Um evento pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */

// GET "/events/k2z5d8m4r1p6s7t3"
router.get('/:id', (req, res) => {
    const id = req.params.id
    eventsDB = loadEvents();
    var event = eventsDB.find((event) => event.id === id )
    if(!event) return res.status(404).json({
        "erro": "Evento não encontrado!"
    })
    res.json(event)
})

/**
 * @swagger
 * /events/{date}:
 *   get:
 *     summary: Retorna um evento pela data
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data do evento no formato ANO-MES-DIA
 *     responses:
 *       200:
 *         description: Um evento pela data
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Data do evento não encontrada
 */

//GET /events/2024-09-19
router.get('/:date', (req, res) => {
  const date = req.params.date;
    eventsDB = loadEvents();
    var event = eventsDB.find((event) => event.date === date);
    if (!event) return res.status(404).json({
        "erro": "Data não encontrada!"
    });
    res.json(event);
})

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: O evento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */

// POST "/events" BODY { "id": "h7r9k2j5w4v8q0b1", "title": "Atividades Recreativas - Diversão e Movimento: Esportes Adaptados", "comments": "Organização: Comitê Paralímpico Catarinense", "description": "Evento que promove competições e atividades recreativas adaptadas, como esportes paralímpicos e jogos inclusivos. Focado em promover a atividade física e a diversão para todos", "location": "Ginásio Municipal de Criciúma, Criciúma - SC", "date": "2024-09-19", "time":  "13:30:00"}
router.post('/', (req, res) => {
    const newEvent = {
        id: uuidv4(),
        ...req.body
    }
    console.log(newEvent);
    eventsDB = loadEvents();
    eventsDB.push(newEvent)
    let result = saveEvents();
    console.log(result);
    return res.json(newEvent)
})

/**
 * @swagger
 * /events/{id}:
 *  put:
 *    summary: Atualiza um evento pelo ID
 *    tags: [Events]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do evento
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Event'
 *    responses:
 *      200:
 *        description: O evento foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      404:
 *        description: Evento não encontrado
 */

// PUT "/students/h7r9k2j5w4v8q0b1" BODY { "id": "n3p6f1x9m2z4l8r7", "title": "Palestra - A Importância da Autoestima e da Autonomia para Pessoas com Deficiências", "comments": "Palestrantes: Dra. Juliana Martins (Psicóloga com foco em autoestima e empoderamento), Marcos Pereira (Coach de vida especializado em autonomia pessoal) e Sílvia Costa (Defensora de direitos e ativista de autonomia)", "description": "Esta palestra discute a importância da autoestima e da autonomia para pessoas com deficiências, abordando estratégias para promover a autoconfiança e independência, e como essas qualidades impactam a qualidade de vida", "location": "Auditório Ruy Hulse - UNESC, Criciúma - SC", "date": "2024-09-09", "time":  "20:00:00"}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const newEvent = req.body
    eventsDB = loadEvents();
    const currentEvent = eventsDB.find((event) => event.id === id )
    const currentIndex = eventsDB.findIndex((event) => event.id === id )
    if(!currentEvent) 
        return res.status(404).json({
        "erro": "Evento não encontrado!"
    })
    eventsDB[currentIndex] = newEvent
    let result = saveEvents();
    console.log(result);
    return res.json(newEvent)
})

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: O evento foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */

// DELETE "/events/n3p6f1x9m2z4l8r7"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    eventsDB = loadEvents();
    const currentEvent = eventsDB.find((event) => event.id === id )
    const currentIndex = eventsDB.findIndex((event) => event.id === id )
    if(!currentEvent) return res.status(404).json({
        "erro": "Evento não encontrado!"
    })
    var deletado = eventsDB.splice(currentIndex, 1)
    let result = saveEvents();
    console.log(result);
    res.json(deletado)
})

module.exports = router
