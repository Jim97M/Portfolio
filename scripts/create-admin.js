require("dotenv").config();

const bcrypt = require("bcryptjs");
const { sequelize, User, Role } = require("../src/models");

async function createAdmin() {
  const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_NAME || !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD in .env first.");
  }
  if (ADMIN_PASSWORD.length < 12 || ADMIN_PASSWORD.length > 128) {
    throw new Error("ADMIN_PASSWORD must be between 12 and 128 characters.");
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("That email already exists. No account was changed.");

  const transaction = await sequelize.transaction();
  try {
    const adminRole = await Role.findOne({ where: { name: "admin" }, transaction });
    if (!adminRole) throw new Error('Admin role is missing. Run "npm run db:migrate" first.');

    const user = await User.create({
      name: ADMIN_NAME.trim(),
      email,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
    }, { transaction });
    await user.addRole(adminRole, { transaction });
    await transaction.commit();
    console.log(`Admin account created for ${email}.`);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

createAdmin()
  .catch((error) => {
    console.error(`Unable to create admin: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());