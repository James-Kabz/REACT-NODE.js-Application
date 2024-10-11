module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "role_permissions",
    {
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permissionId: {
        type: DataTypes.INTEGER,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: false, // Disable timestamps
    }
  );

  // Define associations between RolePermission and Permission, Role
  RolePermission.associate = (models) => {
    RolePermission.belongsTo(models.Permission, {
      foreignKey: "permissionId",
      as: "permission",
    });
    RolePermission.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role",
    });
  };

  return RolePermission;
};
