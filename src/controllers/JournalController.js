import Journal from "../../models/Journal.js"
import { getMoodCategory, getEncouragement, getLastWeekSummary } from "../services/GoogleAI.js"
import { Op } from "sequelize"
const JournalController = {
  async getCollection(req, res) {
    try {
      const journals = await Journal.findAll()
      return res.status(200).send(journals)
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Erroo')
    }
  },
  async add(req, res) {
    try {
      const { userId, note } = req.body
      if (!note) {
        return res.status(400).send({ message: 'Nội dung nhật ký không được để trống.' });
      }
      const mood = await getMoodCategory(note)
      const encouragement = await getEncouragement(mood, note)
      const created = await Journal.create({ userId, note, mood, encouragement })
      return res.status(200).send(created)
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error')

    }
  },
  async getLastWeekSummary(req, res) {
    try {
      const { userId } = req.params
      const lastWeekJournals = await Journal.findAll({
        attributes: ['mood', 'note', 'createdAt'],
        where: {
          userId,
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) // a week ago
          }
        }
      })
      if (!lastWeekJournals || !lastWeekJournals.length) {
        return res.status(200).send({ journals: [] })
      }
      const lastWeekSummary = await getLastWeekSummary(lastWeekJournals.map(journal => ({mood: journal.mood, note: journal.note})))
      return res.status(200).send({ journals:lastWeekJournals, lastWeekSummary })
    } catch (error) {
      console.log(error);
      return res.status(500).send('Server Error')
    }
  },
}

export default JournalController