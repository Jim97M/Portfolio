const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Project extends Model {}

  Project.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      authorId: { type: DataTypes.UUID, allowNull: true, field: "author_id" },
      title: { type: DataTypes.STRING(180), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      role: { type: DataTypes.STRING(120), allowNull: false, defaultValue: "" },
      summary: { type: DataTypes.STRING(500), allowNull: false },
      description: { type: DataTypes.TEXT("long"), allowNull: false },
      techStack: { type: DataTypes.JSON, allowNull: false, defaultValue: [], field: "tech_stack" },
      imageUrl: { type: DataTypes.STRING(500), allowNull: true, field: "image_url" },
      liveUrl: { type: DataTypes.STRING(500), allowNull: true, field: "live_url" },
      sourceUrl: { type: DataTypes.STRING(500), allowNull: true, field: "source_url" },
      featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "draft",
        validate: { isIn: [["draft", "published"]] },
      },
      publishedAt: { type: DataTypes.DATE, allowNull: true, field: "published_at" },
    },
    { sequelize, modelName: "Project", tableName: "projects", underscored: true },
  );

  return Project;
};