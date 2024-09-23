const express = require('express')
const router = express.Router()
const eventsRoutes = require('./eventsRoutes') //Luis Paulo
const studentsRoutes = require('./studentsRoutes') //Miguel

router.use(express.json())
router.use('/events', eventsRoutes) //Luis Paulo
router.use('/students', studentsRoutes) // Miguel

module.exports = router
