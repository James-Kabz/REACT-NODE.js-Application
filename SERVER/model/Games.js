module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define("games", {
    game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Game.associate = (models) => {
    Game.hasMany(models.Sale, { foreignKey: "game_id", as: "sales" }); // Association to Sales
  };

  return Game;
};
