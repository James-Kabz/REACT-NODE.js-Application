module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "roles",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true, // Enable timestamps (createdAt, updatedAt)
    }
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, {foreignKey : "roleId"})
  };

  return Role;
};
