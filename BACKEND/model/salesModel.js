module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define('sales_tbs', {
        sale_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity_sold: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sale_date : {
            type: DataTypes.DATE,
            allowNull: false
        }
    })

    return Sale
    // module.exports = { Sale }
}