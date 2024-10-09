const bcrypt  = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('admins', {
        admin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        admin_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Admin.beforeCreate(async (admins) => {
        try {
            const salt = await bcrypt.genSalt(16);
            const hashedPwd = await bcrypt.hash(admins.password, salt)
            admins.password = hashedPwd;
        } catch (error) {
            throw new Error('Error encrypting Password')
        }
    })

    Admin.prototype.isValidPassword = async function
        (password) { 
        try {
            return await bcrypt.compare(password, this.password)
        } catch (error) {
            throw new Error('Error validating password')
        }
    }
    return Admin
}