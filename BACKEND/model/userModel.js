const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    User.beforeCreate(async (users) => {
        try {
            const salt = await bcrypt.genSalt(16);
            const hashedPwd = await bcrypt.hash(users.password, salt)
            users.password = hashedPwd;
        } catch (error) {
            throw new Error('Error encrypting Password')
        }
    })

    User.prototype.isValidPassword = async function (password) { 
         try {
            return await bcrypt.compare(password, this.password)
        } catch (error) {
            throw new Error('Error validating password')
        } 
    }

    return User
}