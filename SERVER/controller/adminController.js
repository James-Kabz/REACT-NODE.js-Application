const db = require('../model/dbConnect')
const admins = db.admins
const createHttpError = require('http-errors');
const { signAccessToken, signRefreshToken} = require('../helpers/jwtHelpers');
const authSchema = require('../helpers/validateSchema');

module.exports = {
    addAdmin: async (req, res, next) => {
        try {
            const { admin_email, password } = await authSchema.validateAsync(req.body);
            
            const exists = await admins.findOne({
                where: { admin_email } })
            if (exists) {
                throw createHttpError.Conflict(`${admin_email}has already been registered`)
            }

            const newAdmin = new admins({ admin_email, password })
            const savedAdmin = await newAdmin.save()

            const accessToken = await signAccessToken(savedAdmin.admin_id)

            res.send({accessToken})
        } catch (error) {
            console.log(error)

            if (error.isJoi === true) error.status = 422
            next(error)
        } 
    },

    loginAdmin: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body);
            const admin = await admins.findOne({ where: { admin_email: result.admin_email } })
            
            if (!admin) throw createHttpError.NotFound('User not found');

            // password watch
            const isMatch = await admin.isValidPassword(result.password)
            if (!isMatch) throw createHttpError.Unauthorized('Invalid password');

            //if password is match ,then generate token

            const accessToken = await signAccessToken(admin.admin_id);
            const refreshToken = await signRefreshToken(admin.admin_id);

            res.send({ accessToken, refreshToken })
        } catch (error) {
            if (error.isJoi === true)
                return next(createHttpError.BadRequest('Invalid Credentials'));
            next(error)
         }
    }
}