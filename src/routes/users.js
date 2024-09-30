const express = require('express'); // Importa o framework Express para criar o servidor
const fs = require('fs'); // Importa o módulo para manipular arquivos
const path = require('path'); // Importa o módulo para manipular caminhos de arquivos
const router = express.Router(); // Cria um objeto de roteamento para definir rotas da API
const swaggerJsDoc = require('swagger-jsdoc'); // Importa o módulo Swagger para documentação
const swaggerUi = require('swagger-ui-express'); // Importa o módulo Swagger UI para apresentar a documentação

const jsonFilePath = path.join(__dirname, '..', 'data', 'users.json'); // Define o caminho do arquivo JSON onde os cadastros estão armazenados

// Configurações do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Versão da especificação OpenAPI
        info: {
            title: 'API de Cadastros', // Título da API
            version: '1.0.0', // Versão da API
            description: 'API para gerenciar cadastros de usuários', // Descrição da API
            contact: {
                name: 'Seu Nome', // Nome do autor
                email: 'seuemail@example.com', // Email do autor
            },
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL do servidor
            },
        ],
    },
    apis: ['index.js'], // Arquivo onde estão as definições das rotas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions); // Gera a documentação a partir das opções
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Rota para acessar a documentação do Swagger

// Função para ler o JSON
function readJSONFile() {
    try {
        return JSON.parse(fs.readFileSync(jsonFilePath, 'utf8')); // Lê o arquivo JSON e converte seu conteúdo para um objeto JavaScript
    } catch (error) {
        console.error('Erro ao ler o arquivo JSON:', error);
        return []; // Retorna um array vazio em caso de erro
    }
}

// Função para salvar o JSON
function saveJSONFile(data) {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2)); // Converte o objeto JavaScript para JSON e salva no arquivo
        return 'Dados salvos com sucesso';
    } catch (error) {
        console.error('Erro ao salvar o arquivo JSON:', error);
        return 'Erro ao salvar os dados';
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Cadastro:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         level:
 *           type: string
 *       example:
 *         id: "123"
 *         name: "João Silva"
 *         level: "user"
 */

/**
 * @swagger
 * tags:
 *   name: Cadastros
 *   description: API de Controle de Cadastros **Por Rafaela Bez**
 */

/**
 * @swagger
 * /cadastros:
 *   get:
 *     tags: [Cadastros]
 *     summary: Retorna todos os cadastros
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         description: Filtra cadastros pelo nome
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         required: false
 *         description: Filtra cadastros pelo nível
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: false
 *         description: Filtra cadastros pelo ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de cadastros encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cadastro'
 *       404:
 *         description: Nenhum cadastro encontrado com os filtros especificados.
 */

// Rota GET para buscar todos os usuários ou filtrar por nome, level ou id
router.get('/', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { name, level, id } = req.query; // Obtém os parâmetros da query string (id, nome ou level)
    let resultados = data; // Inicializa a lista de resultados com todos os usuários

    // Filtra pelo id, se fornecido
    if (id) {
        resultados = resultados.filter(u => u.id === id);
    } else {
        // Filtra por nome, se fornecido
        if (name) resultados = resultados.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
        // Filtra por level, se fornecido
        if (level) resultados = resultados.filter(u => u.level && u.level.toLowerCase() === level.toLowerCase());
    }

    // Retorna os resultados filtrados ou uma mensagem de erro 404 se nenhum usuário for encontrado
    resultados.length > 0 ? res.json(resultados) : res.status(404).send('Nenhum usuário encontrado com os filtros especificados.');
});

/**
 * @swagger
 * /cadastros/{id}:
 *   get:
 *     tags: [Cadastros]
 *     summary: Retorna um cadastro pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cadastro a ser retornado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cadastro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cadastro'
 *       404:
 *         description: Cadastro não encontrado
 */

// Rota GET para buscar por ID
router.get('/:id', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { id } = req.params; // Obtém o ID da URL
    const user = data.find(u => u.id === id); // Busca o usuário com o ID fornecido
    user ? res.json(user) : res.status(404).send(`Usuário com ID ${id} não encontrado.`); // Retorna o usuário ou um erro 404
});

/**
 * @swagger
 * /cadastros:
 *   post:
 *     tags: [Cadastros]
 *     summary: Adicionar um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cadastro criado com sucesso
 *       400:
 *         description: Erro na requisição
 */

// Rota POST para adicionar um novo usuário
router.post('/', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const novoUsuario = { ...req.body, id: (data.length + 1).toString() }; // Cria um novo usuário com os dados recebidos e gera um novo ID
    data.push(novoUsuario); // Adiciona o novo usuário à lista de cadastros
    saveJSONFile(data); // Salva a lista de cadastros atualizada no arquivo JSON
    res.status(201).json(novoUsuario); // Retorna o novo usuário com status 201 (criado)
});

/**
 * @swagger
 * /cadastros/{id}:
 *   put:
 *     tags: [Cadastros]
 *     summary: Atualiza um cadastro existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cadastro a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cadastro atualizado
 *       404:
 *         description: Cadastro não encontrado
 */

// Rota PUT para atualizar um usuário
router.put('/:id', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { id } = req.params; // Obtém o ID do parâmetro da URL
    const index = data.findIndex(u => u.id === id); // Encontra o índice do usuário com o ID fornecido

    if (index !== -1) {
        const updatedUser = { ...data[index], ...req.body }; // Atualiza os dados do usuário com as novas informações
        data[index] = updatedUser; // Substitui o usuário antigo pelo atualizado
        saveJSONFile(data); // Salva a lista de cadastros atualizada no arquivo JSON
        res.json(updatedUser); // Retorna o usuário atualizado
    } else {
        res.status(404).send(`Usuário com ID ${id} não encontrado.`); // Retorna um erro 404 se o usuário não for encontrado
    }
});

/**
 * @swagger
 * /cadastros/{id}:
 *   delete:
 *     tags: [Cadastros]
 *     summary: Remove um cadastro existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cadastro a ser removido
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cadastro removido com sucesso
 *       404:
 *         description: Cadastro não encontrado
 */

// Rota DELETE para deletar um usuário
router.delete('/:id', (req, res) => {
    const data = readJSONFile(); // Lê o arquivo JSON com os cadastros
    const { id } = req.params; // Obtém o ID do parâmetro da URL
    const index = data.findIndex(u => u.id === id); // Encontra o índice do usuário com o ID fornecido

    if (index !== -1) {
        data.splice(index, 1); // Remove o usuário da lista de cadastros
        saveJSONFile(data); // Salva a lista de cadastros atualizada no arquivo JSON
        res.status(204).send(); // Retorna um status 204 (sem conteúdo)
    } else {
        res.status(404).send(`Usuário com ID ${id} não encontrado.`); // Retorna um erro 404 se o usuário não for encontrado
    }
});

// Exporta o router para ser utilizado em outras partes da aplicação
module.exports = router;
