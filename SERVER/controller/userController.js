const db = require("../model/dbConnect");
const users = db.users;
const createHttpError = require("http-errors");
const { signAccessToken, signRefreshToken } = require("../helpers/jwtHelpers");
const authSchema = require("../helpers/validateSchema");

module.exports = {
  addUser: async (req, res, next) => {
    try {
      const { roleId, email, password } = await authSchema.validateAsync(
        req.body
      );

      const exists = await users.findOne({ where: { email } });
      if (exists) {
        throw createHttpError.Conflict(`${email} has already been registered`);
      }

      // Include roleId when creating a new admin
      const newUser = new users({ roleId, email, password });
      const savedUser = await newUser.save();

      const accessToken = await signAccessToken(savedUser.id, roleId); // Pass roleId to token
      res.send({ accessToken });
    } catch (error) {
      console.log(error);

      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body);
      const user = await users.findOne({ where: { email: result.email } });

      if (!user) throw createHttpError.NotFound("User not found");

      // Password check
      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) throw createHttpError.Unauthorized("Invalid password");

      // Generate tokens
      const accessToken = await signAccessToken(user.id, ); // Pass roleId to token
      const refreshToken = await signRefreshToken(user.userId);

      res.send({ accessToken, refreshToken }); // Include roleId in response
    } catch (error) {
      if (error.isJoi === true)
        return next(createHttpError.BadRequest("Invalid Credentials"));
      next(error);
    }
  },
};
