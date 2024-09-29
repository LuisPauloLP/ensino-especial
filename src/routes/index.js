const express = require('express')
const router = express.Router()
const eventsRoutes = require('./eventsRoutes') //Luis Paulo
const studentsRoutes = require('./studentsRoutes') //Miguel
const teachersRoutes = require('./teachersRoutes') //Natali 
const appointmentsRoutes = require('./appointmentsRoutes') //Maria

router.use(express.json())
router.use('/events', eventsRoutes) //Luis Paulo
router.use('/students', studentsRoutes) // Miguel
router.use('/teachers', teachersRoutes) // Natali
router.use('/appointments', appointmentsRoutes) // Maria

module.exports = router
