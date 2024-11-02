const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/dbConfig");

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
});

// Import Models
const User = require("./User")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
const Permission = require("./Permission")(sequelize, DataTypes);
const RolePermission = require("./RolePermissions")(sequelize, DataTypes);
const Sale = require("./Sale")(sequelize, DataTypes);
const Item = require("./Items")(sequelize, DataTypes);

// Define `db` object to hold all models
const db = {
  Sequelize,
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  Sale,
  Item,
};

// Define Associations
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

Item.hasMany(Sale, { foreignKey: "item_id" });
Sale.belongsTo(Item, { foreignKey: "item_id" });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
});

// Sync Database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
});

// Export the db object
module.exports = db;
