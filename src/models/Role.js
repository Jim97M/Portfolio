const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Role extends Model {}

  Role.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(40), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(200), allowNull: false },
    },
    { sequelize, modelName: "Role", tableName: "roles", underscored: true },
  );

  return Role;
};