const express = require('express');
const gameController = require('../controller/gameController')
const router = express.Router();

router.post('/addGame', gameController.addGame)
router.get('/getAllGames', gameController.getAllGames)
router.get('/getGame/:id', gameController.getGame)
router.patch('/updateGame/:id', gameController.updateGame)
router.delete('/deleteGame/:id', gameController.deleteGame)
module.exports = router;