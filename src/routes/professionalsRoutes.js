const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

var professionalsDB = loadProfessionals();

// Função carrega estudantes a partir do arquivo JSON
function loadProfessionals() {
  try {
    return JSON.parse(fs.readFileSync("./src/db/professionals.json", "utf8"));
  } catch (err) {
    console.log(err);
    return [];
  }
}
// Função para salvar os estudantes no arquivo JSON
function saveProfessionals() {
  try {
    fs.writeFileSync(
      "./src/db/professionals.json",
      JSON.stringify(professionalsDB, null, 2)
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
 *     Profissional:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - specialty
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadastro do profissional
 *         name:
 *           type: string
 *           description: Nome do Profissional
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional
 *         contact:
 *           type: string
 *           description: Email do profissional
 *         phone_number:
 *           type: string
 *           description: Número de contato do profissional
 *         status:
 *           type: string
 *           description: Status do profissional
 *       example:
 *         id: 44d9ee5a-86cc-4264-a372-59b4e229aca4
 *         name: Carlos Almeida
 *         specialty: Pediatra
 *         contact: calmeida.ped@gmail.com
 *         phone_number: 48 9584 4585
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description:
 *     API de Controle de Profissionais
 *     **Por Maria Machado**
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: A lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profissional'
 */
//GET todos os profissionais
router.get("/", (req, res) => {
  professionalsDB = loadProfessionals();
  res.json(professionalsDB);
});

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Retorna um professional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissional'
 *       404:
 *         description: Profissional não encontrado!
 */
// GET profissionais especifico por id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  professionalsDB = loadProfessionals();
  var profissional = professionalsDB.find(
    (professionals) => professionals.id === id
  );
  if (!profissional)
    return res.status(404).json({
      erro: "Profissional não encontrado!",
    });
  res.json(profissional);
});

/**
 * @swagger
 * /professionals/name/{name}:
 *   get:
 *     summary: Retorna um profissional pelo nome
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do profissional
 *     responses:
 *       200:
 *         description: Um profissional pelo nome
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissional'
 *       404:
 *         description: Profissional não encontrado!
 */
// GET profissional especifico por nome
router.get("/name/:name", (req, res) => {
  const name = req.params.name;
  professionalsDB = loadProfessionals();
  var profissional = professionalsDB.filter(
    (professionals) => professionals.name === name
  );
  if (profissional.length === 0)
    return res.status(404).json({
      erro: "Profissional não encontrado!",
    });
  res.json(profissional);
});

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profissional'
 *     responses:
 *       200:
 *         description: O profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profissional'
 *       404_name_not_found:
 *         description: Profissional precisa ter um 'nome'!
 *       404_specialty_not_found:
 *         description: Profissional precisa ter uma 'especialidade'!
 *       404_contact_not_found:
 *         description: Profissional precisa ter uma 'email de contato'!
 *       404_phonenumber_not_found:
 *         description: Profissional precisa ter uma 'número de contato'!
 *       404_status_not_found:
 *         description: Profissional precisa ter um 'status'!
 */
// POST cadastro de profissionais
router.post("/", (req, res) => {
  const newProfessional = {
    id: uuidv4(),
    ...req.body,
  };
  professionalsDB = loadProfessionals();
  if (!newProfessional.name)
    return res.status(400).json({
      erro: "Profissional precisa ter um 'nome'!",
    });
  if (!newProfessional.specialty)
    return res.status(400).json({
      erro: "Profissional precisa ter uma 'especialidade'!",
    });
  if (!newProfessional.contact)
    return res.status(400).json({
      erro: "Profissional precisa ter uma 'email de contato'!",
    });
  if (!newProfessional.phone_number)
    return res.status(400).json({
      erro: "Profissional precisa ter uma 'número de contato'!",
    });
  if (!newProfessional.status)
    return res.status(400).json({
      erro: "Profissional precisa ter um 'status'!",
    });
  professionalsDB.push(newProfessional);
  let resultado = saveProfessionals();
  console.log(resultado);
  return res.json(newProfessional);
});

/**
 * @swagger
 * /professionals/{id}:
 *  put:
 *    summary: Atualiza um professional pelo ID
 *    tags: [Professionals]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do profissional
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Profissional'
 *    responses:
 *      200:
 *        description: O profissional foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Profissional'
 *      404:
 *        description: Profissional não encontrado!
 */
// UPDATE do registro nas funções
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const newProfessional = req.body;
  professionalsDB = loadProfessionals();
  const currentProfessional = professionalsDB.find(
    (professionals) => professionals.id === id
  );
  const currentIndex = professionalsDB.findIndex(
    (professionals) => professionals.id === id
  );
  if (!currentProfessional)
    return res.status(404).json({
      erro: "Profissional não encontrado!",
    });

  professionalsDB[currentIndex] = newProfessional;
  let resultado = saveProfessionals();
  console.log(resultado);
  return res.json(newProfessional);
});

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: O profissional foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Profissional'
 *       404:
 *         description: Profissional não encontrado!
 */
// DELETE cadastro de profissionais
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  professionalsDB = loadProfessionals();
  const professional = professionalsDB.find(
    (professionals) => professionals.id === id
  );
  const currentIndex = professionalsDB.findIndex(
    (professionals) => professionals.id === id
  );
  if (!professional)
    return res.status(404).json({
      erro: "Profissional não encontrado!",
    });
  var deletado = professionalsDB.splice(currentIndex, 1);
  let resultado = saveProfessionals();
  console.log(resultado);
  res.json(deletado);
});

module.exports = router;
