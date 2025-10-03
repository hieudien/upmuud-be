import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js';

const Journal = sequelize.define('Journal', {
  userId: {
    type: DataTypes.STRING,
  },
  note: {
    type: DataTypes.TEXT,
  },
  mood: {
    type: DataTypes.STRING,
  },
  encouragement: {
    type: DataTypes.TEXT,
  },
});

export default Journal;
