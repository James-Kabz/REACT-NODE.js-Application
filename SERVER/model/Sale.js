module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("sales", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: "games",
        },
        key: "game_id",
      },
      onDelete: "CASCADE", // Optional: Defines behavior on deletion
    },
    quantity_sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sale_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Sale;
};
