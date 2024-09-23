const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var studentsDB = loadStudents();

// Função carrega estudantes a partir do arquivo JSON
function loadStudents() {  
    try {
      return JSON.parse(fs.readFileSync('./db/students.json', 'utf8'));
    } catch (err) {
      return [];
    }
  }
// Função para salvar os estudantes no arquivo JSON
function saveStudents() {
    try {
      fs.writeFileSync('./db/students.json', JSON.stringify(studentsDB, null, 2));
      return "Saved"
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
router.get('/', (req, res) =>{
    console.log("getroute");
    studentsDB = loadStudents();
    res.json(studentsDB);
})

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
... (136 linhas)
