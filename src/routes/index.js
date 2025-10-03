import express from 'express'
import JournalController from '../controllers/JournalController.js'
const router = express.Router()

router.post('/add', JournalController.add)
router.get('/getLastWeekSummary/:userId', JournalController.getLastWeekSummary)

export default router