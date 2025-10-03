import Sequelize from 'sequelize'
// const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_DIALECT } = process.env.DB_CONNECTION_STRING
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING);
export default sequelize