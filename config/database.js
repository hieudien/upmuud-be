import Sequelize from 'sequelize'
import pg from 'pg';
// const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT } = process.env.DB_CONNECTION_STRING
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
export default sequelize