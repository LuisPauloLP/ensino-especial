const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

var studentsDB = loadStudents();

// Função carrega estudantes a partir do arquivo JSON
function loadStudents() {
  try {
    return JSON.parse(fs.readFileSync("./src/db/students.json", "utf8"));
  } catch (err) {
    console.log(err);
    return [];
  }
}
// Função para salvar os estudantes no arquivo JSON
function saveStudents() {
  try {
    fs.writeFileSync(
      "./src/db/students.json",
      JSON.stringify(studentsDB, null, 2)
    );
    return "Saved";
  } catch (err) {
    return "Not saved";
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadasdro do estudante
 *         nome:
 *           type: string
 *           description: Nome do Estudante
 *       example:
 *         id: "1329"
 *         nome: João Menezes
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description:
 *     API de Controle de Estudantes
 *     **Por Miguel Lumertz**
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */

// GET "/students"
router.get("/", (req, res) => {
  console.log("getroute");
  studentsDB = loadStudents();
  res.json(studentsDB);
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// GET "/students/a3b7k9p2r5"
router.get("/:id", (req, res) => {
  const id = req.params.id;
  studentsDB = loadStudents();
  var student = studentsDB.find((student) => student.id === id);
  if (!student)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  res.json(student);
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: O estudante foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 */

// POST "/students" BODY { "id": "h7r9k2j5w4", "name": "giuberto", "age": "24", "class": "2", "course": "Direito", "parents": "jouel e heby", "phone_number":  "48 7394 3566",  "address": "rua Gabriel Asevado",  "special_needs": "autismo",  "status": "on"}
router.post("/", (req, res) => {
  const newStudent = {
    id: uuidv4(),
    ...req.body,
  };
  console.log(newStudent);
  studentsDB = loadStudents();
  studentsDB.push(newStudent);
  let result = saveStudents();
  console.log(result);
  return res.json(newStudent);
});

/**
 * @swagger
 * /students/{id}:
 *  put:
 *    summary: Atualiza um estudante pelo ID
 *    tags: [Students]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do estudante
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    responses:
 *      200:
 *        description: O estudante foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
 *      404:
 *        description: Estudante não encontrado
 */

// PUT "/students/h7r9k2j5w4" BODY { "id": "i85l0k1x5w4", "name": "Andressa", "age": "27", "class": "2", "course": "Direito", "parents": "Mollie e Marcos", "phone_number":  "11 7394 3566",  "address": "rua Machado de Macedo",  "special_needs": "autismo",  "status": "on"}
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const newStudent = req.body;
  studentsDB = loadStudents();
  const currentStudent = studentsDB.find((student) => student.id === id);
  const currentIndex = studentsDB.findIndex((student) => student.id === id);
  if (!currentStudent)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  studentsDB[currentIndex] = newStudent;
  let result = saveStudents();
  console.log(result);
  return res.json(newStudent);
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Remove um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: O estudante foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

// DELETE "/students/i85l0k1x5w4"
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  studentsDB = loadStudents();
  const currentStudent = studentsDB.find((student) => student.id === id);
  const currentIndex = studentsDB.findIndex((student) => student.id === id);
  if (!currentStudent)
    return res.status(404).json({
      erro: "Aluno não encontrado!",
    });
  var deletado = studentsDB.splice(currentIndex, 1);
  let result = saveStudents();
  console.log(result);
  res.json(deletado);
});

module.exports = router;
