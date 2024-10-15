const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operaterAliases: false,
});

// Import models
const User = require("./userModel")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
// const Permission = require("./Permission")(sequelize, DataTypes);
// const RolePermission = require("./RolePermissions")(sequelize, DataTypes);
// dbConnect.js
const RolePermission = require("./RolePermissions");
const Permission = require("./Permission");

module.exports = { RolePermission, Permission, sequelize };

// Store models in an object
const models = { User,Role, Permission, RolePermission };

// Setup associations between models
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);
db.sales = require("./Sale")(sequelize, DataTypes);
db.games = require("./Games")(sequelize, DataTypes);
db.roles = require("./Role")(sequelize, DataTypes);
db.permissions = require("./Permission")(sequelize, DataTypes);
db.rolePermissions = require("./RolePermissions")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("re-sync done");
});

// db.games.hasMany(db.sales, { foreignKey: "game_id" });
// db.sales.belongsTo(db.games, { foreignKey: "game_id" });
// db.users.belongsTo(db.roles, { foreignKey: "roleId" });
// // db.roles.hasMany(db.users, { foreignKey : "id"})


module.exports = { RolePermission, Permission, sequelize };
module.exports = { sequelize, ...models};

module.exports = db;

