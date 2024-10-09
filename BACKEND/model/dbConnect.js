const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");
const {Game} = require("../model/gamesModel")
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operaterAliases: false,
});

sequelize.authenticate()
    .then(() => {
     console.log("Connection has been established successfully.");
    })
    .catch((err) => {
        console.log("Error" + err);
    })

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.admins = require('./adminModel')(sequelize, DataTypes);
db.users = require('./userModel')(sequelize, DataTypes);
db.sales = require('./salesModel')(sequelize, DataTypes);
db.games =  require('./gamesModel')(sequelize,DataTypes)

db.sequelize.sync({force: false})
    .then(() => {
    console.log('re-sync done')
    })

// db.sales.belongsTo(db.games,{foreignKey: 'game_id'})
db.sales.belongsTo(db.games, { foreignKey: 'game_id' });

module.exports = db