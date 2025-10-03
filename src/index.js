import express from 'express'
import cors from 'cors'
import sequelize from '../config/database.js'
import router from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 5000

  const allowedOrigins = [process.env.FRONTEND_SITE, process.env.FRONTEND_SITE_LOCAL];
    app.use(cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    }));

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.disable('etag');
function errorHandler (err, req, res, next) {
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
      console.log(error)
    });
} catch (error) {
  console.log(error);
}

app.get('/', (req, res) => {
  res.send('hello upmuud')
})

