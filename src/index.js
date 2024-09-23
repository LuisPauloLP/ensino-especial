const express = require('express')
const app = express()
const cors = require("cors");

app.use(cors());

//swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const routes = require('./routes')

const hostname = '127.0.0.1';
const port = 3000;

//swagger
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API de Gestão de Ensino Especial",
			version: "1.0.0",
			description: `API para demonstração de Documentação API via Swagger.  
            
            ### TD 01    
            Disciplina: Desenvolvimento de Alicações II 2024.09 Turma 01  
            Equipe: Luís Paulo, Maria Fernanda Esteves, Miguel Lumertz, Natali Elias e Rafaela Nicoski   
			`,
      license: {
        name: 'Licenciado para Desenvolvimento de Aplicações II',
      },
      contact: {
        name: 'Luís Paulo, Maria Fernanda Esteves, Miguel Lumertz, Natali Elias e Rafaela Nicoski'
      },
		},
		servers: [
			{
				url: "http://localhost:3000/",
        description: 'Server de desenvolvimento',
			},
		],
	},
	apis: [__dirname + "/routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use('/', routes)
//swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));



app.listen(port, () => {
  console.log(`Server rodando em http://${hostname}:${port}/api-docs`)
})
