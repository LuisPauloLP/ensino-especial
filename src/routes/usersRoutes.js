const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');

var usersDB = loadUsers();

// Função carrega estudantes a partir do arquivo JSON
function loadUsers() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/users.json', 'utf8'));
    } catch (err) {
      return [];
    }
}
// Função para salvar os estudantes no arquivo JSON
function saveUsers() {
    try {
      fs.writeFileSync('./src/db/users.json', JSON.stringify(usersDB, null, 2));
      return "Saved"
    } catch (err) {
      return "Not saved";
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadastro do usuário
 *         name:
 *           type: string
 *           description: Nome do Usuário
 *         email:
 *           type: string
 *           description: Email do Usuário
 *         user:
 *           type: string
 *           description: Nome de Usuário
 *         pwd:
 *           type: string
 *           description: Senha do Usuário
 *         level:
 *           type: string
 *           description: Nível do Usuário
 *         status:
 *           type: string
 *           description: Status do usuário
 *       example:
 *         id: 0690a0fe-288c-454b-8c28-75d72a905645
 *         name: Gabriela dos Santos
 *         email: santo.gabi@gmail.com
 *         user: gabi.santos
 *         pwd: gabi123
 *         level: admin
 *         status: on
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: 
  *     API de Controle de Usuários
  *     **Por Maria Machado**
  */

 /**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */
//GET todos os usuários
router.get('/', (req, res) =>{
    usersDB = loadUsers();
    res.json(usersDB);
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Um usuário pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario não encontrado!
 */
// GET profissionais especifico por id
router.get('/:id', (req, res) => {
    const id = req.params.id
    usersDB = loadUsers();
    var usuario = usersDB.find((users) => users.id === id)
    if(!usuario) return res.status(404).json({
        "erro": "Usuario não encontrado!"
    })
    res.json(usuario)
})

/**
 * @swagger
 * /users/name/{name}:
 *   get:
 *     summary: Retorna um usuário pelo nome
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do usuário
 *     responses:
 *       200:
 *         description: Um usuário pelo nome
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado!
 */
// GET usuário especifico por nome
router.get('/name/:name', (req, res) => {
    const name = req.params.name
    usersDB = loadUsers();
    var usuario = usersDB.filter((users) => users.name === name)
    if(usuario.length === 0) return res.status(404).json({
        "erro": "Usuário não encontrado!"
    })
    res.json(usuario)
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: O usuário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404_name_not_found:
 *         description: Usuário precisa ter um 'nome'!
 *       404_email_not_found:
 *         description: Usuário precisa ter um 'email'!
 *       404_user_not_found:
 *         description: Usuário precisa ter um 'usuário'!
 *       404_pwd_not_found:
 *         description: Usuário precisa ter uma 'senha'!
 *       404_level_not_found:
 *         description: Usuário precisa ter um 'nível'!
 *       404_status_not_found:
 *         description: Usuário precisa ter um 'status'!
 */
// POST cadastro de profissionais
router.post('/', (req, res) => {
    const newUser = {
        id: uuidv4(),
        ...req.body
    }
    usersDB = loadUsers();
    if(!newUser.name) return res.status(400).json({
        "erro": "Usuário precisa ter um 'nome'!"
    })
    if(!newUser.email) return res.status(400).json({
        "erro": "Usuário precisa ter um 'email'!"
    })
    if(!newUser.user) return res.status(400).json({
        "erro": "Usuário precisa ter um 'usuário'!"
    })
    if(!newUser.pwd) return res.status(400).json({
        "erro": "Usuário precisa ter uma 'senha'!"
    })
    if(!newUser.level) return res.status(400).json({
        "erro": "Usuário precisa ter um 'nível'!"
    })
    if(!newUser.status) return res.status(400).json({
        "erro": "Usuário precisa ter um 'status'!"
    })
    usersDB.push(newUser)
    let resultado = saveUsers();
    console.log(resultado)
    return res.json(newUser)
})

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Atualiza um usuário pelo ID
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do usuário
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Usuario'
 *    responses:
 *      200:
 *        description: O usuário foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Usuario'
 *      404:
 *        description: Usuário não encontrado!
 */
// UPDATE do registro nas funções
router.put('/:id', (req, res) => {
    const id = req.params.id
    const newUser = req.body 
    usersDB = loadUsers();
    const currentUser = usersDB.find((users) => users.id === id)
    const currentIndex = usersDB.findIndex((users) => users.id === id)
    if(!currentUser) 
        return res.status(404).json({
        "erro": "Usuário não encontrado!"
    })

    usersDB[currentIndex]  = newUser 
    let resultado = saveUsers();
    console.log(resultado)
    return res.json(newUser)
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: O usuário foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado!
 */
// DELETE cadastro de usuários
router.delete('/:id', (req, res) => {
    const id = req.params.id
    usersDB = loadUsers();
    const user = usersDB.find((users) => users.id === id)
    const currentIndex = usersDB.findIndex((users) => users.id === id)
    if(!user) return res.status(404).json({
        "erro": "Usuário não encontrado!"
    })
    var deletado = usersDB.splice(currentIndex, 1)
    let resultado = saveUsers();
    console.log(resultado)
    res.json(deletado)
})


module.exports = router