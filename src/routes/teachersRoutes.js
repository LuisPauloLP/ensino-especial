const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var teachersDB = loadTeachers();

function loadTeachers() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/dbteachers.json', 'utf8'));
  } catch (err) {
    console.log(err);
    return [];
  }
}

function saveTeachers() {
  try {
    fs.writeFileSync('./src/db/dbteachers.json', JSON.stringify(teachersDB, null, 2));
    return "Saved";
  } catch (err) {
    return "Not saved";
  }
}

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Teachers API",
      description: "API for managing teachers",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Teacher: {
          type: "object",
          required: ["id", "name", "school_disciplines", "contact", "phone_number", "status"],
          properties: {
            id: {
              type: "string",
              description: "O id é gerado automaticamente pelo cadastro do professor",
            },
            name: {
              type: "string",
              description: "Nome do Professor",
            },
            school_disciplines: {
              type: "string",
              description: "Disciplinas escolares que o professor leciona",
            },
            contact: {
              type: "string",
              description: "Contato do professor",
            },
            phone_number: {
              type: "string",
              description: "Número de telefone do professor",
            },
            status: {
              type: "string",
              description: "Status do professor",
            },
          },
          example: {
            id: "1",
            name: "Judite Heeler",
            school_disciplines: "Artes, Português",
            contact: "j.heeler@gmail",
            phone_number: "48 9696 5858",
            status: "on",
          },
        },
      },
    },
  },
  apis: ["./src/routes/teachersRoutes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do professor
 *         name:
 *           type: string
 *           description: Nome do Professor
 *         school_disciplines:
 *           type: string
 *           description: Disciplinas escolares que o professor leciona
 *         contact:
 *           type: string
 *           description: Contato do professor
 *         phone_number:
 *           type: string
 *           description: Número de telefone do professor
 *         status:
 *           type: string
 *           description: Status do professor
 *       example:
 *         id: "1"
 *         name: "Judite Heeler"
 *         school_disciplines: "Artes, Português"
 *         contact: "j.heeler@gmail"
 *         phone_number: "48 9696 5858"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API de Controle de Professores
 *     **Por Natali Elias**
 */

/**
 * @swagger
 * /teachers/search:
 *   get:
 *     summary: Retorna uma lista de professores com base na pesquisa por nome
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do professor para buscar
 *     responses:
 *       200:
 *         description: A lista de professores encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Nenhum professor encontrado com esse nome
 */

router.get('/search', (req, res) => {
  const { name } = req.query;  
  if (!name) return res.status(400).json({ "erro": "O parâmetro 'name' é obrigatório para a pesquisa" });

  teachersDB = loadTeachers();
  
  const filteredTeachers = teachersDB.filter(teacher => 
    teacher.name.toLowerCase().includes(name.toLowerCase())
  );

  if (filteredTeachers.length === 0) {
    return res.status(404).json({ "erro": "Nenhum professor encontrado com esse nome!" });
  }

  res.json(filteredTeachers);
});

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */

router.get('/', (req, res) => {
  teachersDB = loadTeachers();
  res.json(teachersDB);
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Um professor pelo ID
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

router.get('/:id', (req, res) => {
  const id = req.params.id;
  teachersDB = loadTeachers();
  const teacher = teachersDB.find((teacher) => teacher.id === id);
  if (!teacher) return res.status(404).json({ "erro": "Professor não encontrado!" });
  res.json(teacher);
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: O professor foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 */

router.post('/', (req, res) => {
  const newTeacher = {
    id: uuidv4(),
    ...req.body
  };
  teachersDB = loadTeachers();
  teachersDB.push(newTeacher);
  let result = saveTeachers();
  console.log(result);
  return res.json(newTeacher);
});

/**
 * @swagger
 * /teachers/{id}:
 *  put:
 *    summary: Atualiza um professor pelo ID
 *    tags: [Teachers]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do professor
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Teacher'
 *    responses:
 *      200:
 *        description: O professor foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Teacher'
 *      404:
 *        description: Professor não encontrado
 */

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const newTeacher = req.body;
  teachersDB = loadTeachers();
  const currentTeacher = teachersDB.find((teacher) => teacher.id === id);
  const currentIndex = teachersDB.findIndex((teacher) => teacher.id === id);
  if (!currentTeacher) return res.status(404).json({ "erro": "Professor não encontrado!" });
  teachersDB[currentIndex] = { id, ...newTeacher }; // Mantém o ID e atualiza os demais campos
  let result = saveTeachers();
  console.log(result);
  return res.json(teachersDB[currentIndex]);
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Remove um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: O professor foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  teachersDB = loadTeachers();
  const currentTeacher = teachersDB.find((teacher) => teacher.id === id);
  const currentIndex = teachersDB.findIndex((teacher) => teacher.id === id);
  if (!currentTeacher) return res.status(404).json({ "erro": "Professor não encontrado!" });
  const deleted = teachersDB.splice(currentIndex, 1);
  let result = saveTeachers();
  console.log(result);
  res.json(deleted);
});

module.exports = router;

