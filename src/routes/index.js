const express = require('express')
const router = express.Router()
const eventsRoutes = require('./eventsRoutes') //Luis Paulo
const studentsRoutes = require('./studentsRoutes') //Miguel
// const countriesRoutes = require('./countriesRoutes')

router.use(express.json())
router.use('/eventos', eventsRoutes) //Luis Paulo
router.use('/estudantes', studentsRoutes) // Miguel
// router.use('/countries', countriesRoutes)

module.exports = router
