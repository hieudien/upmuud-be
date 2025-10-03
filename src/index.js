import express from 'express'
import cors from 'cors'
import sequelize from '../config/database.js'
import router from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.disable('etag');
function errorHandler(err, req, res, next) {
  console.log('Error:', err)

  res.status(500)
  res.render('error', { error: err })
}
app.use(errorHandler)
app.use('/journal', router)

try {
  sequelize.authenticate().then(async () => {
    if (process.argv.includes('syncAllDB')) {
      await sequelize.sync({ alter: true });
    }
    app.get('/test', (req, res) => {
      res.send('Hello')
    })
    app.listen(PORT, () => {
      console.log('Server has started on port: ', PORT);
    })
  })
    .catch((error) => {
      console.log('Error:', error)
    });
} catch (error) {
  console.log('Error:', error)
}

app.get('/', (req, res) => {
  console.log("log get / request")
  res.send('hello upmuud')
})

export default app