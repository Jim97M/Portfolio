const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class BlogPost extends Model {}

  BlogPost.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      authorId: { type: DataTypes.UUID, allowNull: true, field: "author_id" },
      title: { type: DataTypes.STRING(180), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      excerpt: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
      content: { type: DataTypes.TEXT("long"), allowNull: false },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "draft",
        validate: { isIn: [["draft", "published"]] },
      },
      coverImageUrl: { type: DataTypes.STRING(500), allowNull: true, field: "cover_image_url" },
      videoUrl: { type: DataTypes.STRING(500), allowNull: true, field: "video_url" },
      videoPosterUrl: { type: DataTypes.STRING(500), allowNull: true, field: "video_poster_url" },
      captionsUrl: { type: DataTypes.STRING(500), allowNull: true, field: "captions_url" },
      publishedAt: { type: DataTypes.DATE, allowNull: true, field: "published_at" },
    },
    { sequelize, modelName: "BlogPost", tableName: "blog_posts", underscored: true },
  );

  return BlogPost;
};