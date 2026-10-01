module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("projects", {
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
      role: { type: Sequelize.STRING(120), allowNull: false, defaultValue: "" },
      summary: { type: Sequelize.STRING(500), allowNull: false },
      description: { type: Sequelize.TEXT("long"), allowNull: false },
      tech_stack: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
      image_url: { type: Sequelize.STRING(500), allowNull: true },
      live_url: { type: Sequelize.STRING(500), allowNull: true },
      source_url: { type: Sequelize.STRING(500), allowNull: true },
      featured: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: "draft" },
      published_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex("projects", ["status", "featured", "sort_order"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("projects");
  },
};