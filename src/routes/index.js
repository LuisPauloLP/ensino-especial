const express = require('express')
const router = express.Router()
const eventsRoutes = require('./eventsRoutes') //Luis Paulo
// const herosRoutes = require('./herosRoutes')
// const countriesRoutes = require('./countriesRoutes')

router.use(express.json())
router.use('/eventos', eventsRoutes) //Luis Paulo
// router.use('/heros', herosRoutes)
// router.use('/countries', countriesRoutes)

module.exports = router





