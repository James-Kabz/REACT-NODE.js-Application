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
        model: "games", // Specify the model name as a string
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

  Sale.associate = (models) => {
    Sale.belongsTo(models.Game, { foreignKey: "game_id", as: "game" }); // Association to Game
  };

  return Sale;
};
