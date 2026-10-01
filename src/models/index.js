const sequelize = require("../config/database");
const User = require("./User")(sequelize);
const Role = require("./Role")(sequelize);
const BlogPost = require("./BlogPost")(sequelize);
const Project = require("./Project")(sequelize);
const UserRole = sequelize.define("UserRole", {}, {
	tableName: "user_roles",
	timestamps: false,
	underscored: true,
});

User.belongsToMany(Role, { through: UserRole, as: "roles", foreignKey: "user_id", otherKey: "role_id" });
Role.belongsToMany(User, { through: UserRole, as: "users", foreignKey: "role_id", otherKey: "user_id" });
BlogPost.belongsTo(User, { as: "author", foreignKey: "author_id" });
User.hasMany(BlogPost, { as: "posts", foreignKey: "author_id" });
Project.belongsTo(User, { as: "author", foreignKey: "author_id" });
User.hasMany(Project, { as: "projects", foreignKey: "author_id" });

module.exports = { sequelize, User, Role, UserRole, BlogPost, Project };