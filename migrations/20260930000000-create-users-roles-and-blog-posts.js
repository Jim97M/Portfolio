const { randomUUID } = require("node:crypto");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      description: { type: Sequelize.STRING(200), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("users", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(100), allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      last_login_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("user_roles", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "roles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.createTable("blog_posts", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      author_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title: { type: Sequelize.STRING(180), allowNull: false },
      slug: { type: Sequelize.STRING(200), allowNull: false, unique: true },
      excerpt: { type: Sequelize.STRING(500), allowNull: false, defaultValue: "" },
      content: { type: Sequelize.TEXT("long"), allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "draft" },
      cover_image_url: { type: Sequelize.STRING(500), allowNull: true },
      video_url: { type: Sequelize.STRING(500), allowNull: true },
      video_poster_url: { type: Sequelize.STRING(500), allowNull: true },
      captions_url: { type: Sequelize.STRING(500), allowNull: true },
      published_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex("blog_posts", ["status", "published_at"]);
    await queryInterface.bulkInsert("roles", [
      { id: randomUUID(), name: "admin", description: "Manage users, roles, and all blog posts", created_at: new Date(), updated_at: new Date() },
      { id: randomUUID(), name: "editor", description: "Create and manage blog posts", created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("blog_posts");
    await queryInterface.dropTable("user_roles");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
  },
};