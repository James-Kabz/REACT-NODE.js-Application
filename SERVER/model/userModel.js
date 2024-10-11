const bcrypt = require("bcrypt");
const { type, keys } = require("../helpers/validateUser");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: "roles",
        },
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.beforeCreate(async (users) => {
    try {
      const salt = await bcrypt.genSalt(16);
      const hashedPwd = await bcrypt.hash(users.password, salt);
      users.password = hashedPwd;
    } catch (error) {
      throw new Error("Error encrypting Password");
    }
  });

  User.prototype.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error("Error validating password");
    }
  };

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId", as: "role" }); // A user belongs to a role
  };

  return User;
};
