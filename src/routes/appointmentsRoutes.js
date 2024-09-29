const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

var appointmentsDB = loadAppointments();

// Função carrega estudantes a partir do arquivo JSON
function loadAppointments() {
  try {
    return JSON.parse(fs.readFileSync("./src/db/appointments.json", "utf8"));
  } catch (err) {
    console.log(err);
    return [];
  }
}
// Função para salvar os estudantes no arquivo JSON
function saveAppointments() {
  try {
    fs.writeFileSync(
      "./src/db/appointments.json",
      JSON.stringify(appointmentsDB, null, 2)
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
 *     Appointment:
 *       type: object
 *       required:
 *         - id
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadastro do agendamento
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional
 *         comments:
 *           type: string
 *           description: Comentário sobre o que vai ser o agendamento
 *         date:
 *           type: date
 *           description: Data do agendamento
 *         student:
 *           type: string
 *           description: Nome do estudante
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *       example:
 *         id: 2571db14-0616-4886-aaa4-4517bb0988e8
 *         specialty: Fisioterapeuta
 *         comments: Sessão
 *         date: 2024-11-24 15:00:00
 *         student: Eduarda Fernandes
 *         professional: Guilherme Baltezar
 */

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description:
 *     API de Controle de Agendamentos
 *     **Por Maria Machado**
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna uma lista de todos os agendamentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
//GET todos os agendamentos
router.get("/", (req, res) => {
  appointmentsDB = loadAppointments();
  res.json(appointmentsDB);
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Um agendamento pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado!
 */
// GET agendamento especifico por id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  appointmentsDB = loadAppointments();
  var appointments = appointmentsDB.find(
    (appointments) => appointments.id === id
  );
  if (!appointments)
    return res.status(404).json({
      erro: "Agendamento não encontrado!",
    });
  res.json(appointments);
});

/**
 * @swagger
 * /appointments/professional/{professional}:
 *   get:
 *     summary: Retorna um agendamento pelo profissional
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: professional
 *         schema:
 *           type: string
 *         required: true
 *         description: Profissional do agendamento
 *     responses:
 *       200:
 *         description: Um agendamento pelo profissional
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento com esse profissional não encontrado!
 */
// GET agendamento especifico por nome do profissional
router.get("/professional/:professional", (req, res) => {
  const professional = req.params.professional;
  appointmentsDB = loadAppointments();
  var appointments = appointmentsDB.filter(
    (appointments) => appointments.professional === professional
  );
  if (appointments.length === 0)
    return res.status(404).json({
      erro: "Agendamento com esse profissional não encontrado!",
    });
  res.json(appointments);
});

/**
 * @swagger
 * /appointments/student/{student}:
 *   get:
 *     summary: Retorna um agendamento pelo estudante
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: student
 *         schema:
 *           type: string
 *         required: true
 *         description: Estudante do agendamento
 *     responses:
 *       200:
 *         description: Um agendamento pelo estudante
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento com esse estudante não encontrado!
 */
// GET personagem especifico por nome do estudante
router.get("/student/:student", (req, res) => {
  const student = req.params.student;
  appointmentsDB = loadAppointments();
  var appointments = appointmentsDB.filter(
    (appointments) => appointments.student === student
  );
  if (appointments.length === 0)
    return res.status(404).json({
      erro: "Agendamento com esse estudante não encontrado!",
    });
  res.json(appointments);
});

/**
 * @swagger
 * /appointments/date/{date}:
 *   get:
 *     summary: Retorna um agendamento pela data
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data do agendamento
 *     responses:
 *       200:
 *         description: Um agendamento pela data
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento com essa data não encontrado!
 */
// GET personagem especifico por data
router.get("/date/:date", (req, res) => {
  const date = req.params.date;
  appointmentsDB = loadAppointments();
  var appointments = appointmentsDB.filter(
    (appointments) => appointments.date === date
  );
  if (appointments.length === 0)
    return res.status(404).json({
      erro: "Agendamento com essa data não encontrado!",
    });
  res.json(appointments);
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: O agendamento foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404_specialty_not_found:
 *         description: Agendamento precisa ter uma 'especialidade'!
 *       404_comments_not_found:
 *         description: Agendamento precisa ter uma 'comentário'!
 *       404_date_not_found:
 *         description: Agendamento precisa ter uma 'data'!
 *       404_student_not_found:
 *         description: Agendamento precisa ter um 'estudante'!
 *       404_professional_not_found:
 *         description: Agendamento precisa ter um 'profissional'!
 */
// POST cadastro de agendamentos
router.post("/", (req, res) => {
  const newAppointment = {
    id: uuidv4(),
    ...req.body,
  };
  appointmentsDB = loadAppointments();
  if (!newAppointment.specialty)
    return res.status(400).json({
      erro: "Agendamento precisa ter uma 'especialidade'!",
    });
  if (!newAppointment.comments)
    return res.status(400).json({
      erro: "Agendamento precisa ter uma 'comentário'!",
    });
  if (!newAppointment.date)
    return res.status(400).json({
      erro: "Agendamento precisa ter uma 'data'!",
    });
  if (!newAppointment.student)
    return res.status(400).json({
      erro: "Agendamento precisa ter um 'estudante'!",
    });
  if (!newAppointment.professional)
    return res.status(400).json({
      erro: "Agendamento precisa ter um 'profissional'!",
    });
  appointmentsDB.push(newAppointment);
  let resultado = saveAppointments();
  console.log(resultado);
  return res.json(newAppointment);
});

/**
 * @swagger
 * /appointments/{id}:
 *  put:
 *    summary: Atualiza um agendamento pelo ID
 *    tags: [Appointments]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do agendamento
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Appointment'
 *    responses:
 *      200:
 *        description: O agendamento foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *      404:
 *        description: Agendamento não encontrado!
 */
// UPDATE do registro nas funções
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const newAppointment = req.body;
  appointmentsDB = loadAppointments();
  const currentAppointment = appointmentsDB.find(
    (appointments) => appointments.id === id
  );
  const currentIndex = appointmentsDB.findIndex(
    (appointments) => appointments.id === id
  );
  if (!currentAppointment)
    return res.status(404).json({
      erro: "Agendamento não encontrado!",
    });

  appointmentsDB[currentIndex] = newAppointment;
  let resultado = saveAppointments();
  console.log(resultado);
  return res.json(newAppointment);
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: O agendamento foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado!
 */
// DELETE cadastro de agendamentos
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  appointmentsDB = loadAppointments();
  const appointments = appointmentsDB.find(
    (appointments) => appointments.id === id
  );
  const index = appointmentsDB.findIndex(
    (appointments) => appointments.id === id
  );
  if (!appointments)
    return res.status(404).json({
      erro: "Agendamento não encontrado!",
    });
  var deletado = appointmentsDB.splice(index, 1);
  let resultado = saveAppointments();
  console.log(resultado);
  res.json(deletado);
});

module.exports = router;
