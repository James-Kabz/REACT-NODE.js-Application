module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "role_permissions",
    {
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permissionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: false,
      freezeTableName: true, // Prevents Sequelize from pluralizing table names
    }
  );

  // Define relationships
  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
    // RolePermission model
    RolePermission.belongsTo(models.Permission, {
      foreignKey: "permissionId",
      as: "permission",
    });
  };

  return RolePermission;
};
