"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require("bcrypt");

    // Hash the password
    const hashedPassword = await bcrypt.hash("@kabz123", 10);

    // Insert the role first
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          roleName: "super-admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Then insert the user and reference the roleId
    await queryInterface.bulkInsert(
      "users",
      [
        {
          roleId: 1, // Assuming 1 is the role ID for "super-admin"
          email: "kabogp@gmail.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Delete users first, then roles to maintain foreign key constraints
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
