const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config")[process.env.NODE_ENV];

let sequelize = null;

if (sequelize === null) {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
      logging: process.env.NODE_ENV === "test" ? false : console.log,
    });
}

sequelize.authenticate()
.then(() => {
    console.log("Database Conected");
})
.catch(err => {
    console.log("Database Not Conected", err);
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize

db.user = require("../models/user")(sequelize, DataTypes);
db.role = require("../models/role")(sequelize, DataTypes);
db.leaveRequest = require("../models/leaveRequest")(sequelize, DataTypes);
db.userLeaveModel = require("../models/userLeaveModel")(sequelize, DataTypes);

db.role.hasMany(db.user, { foreignKey: "role" });
db.user.hasMany(db.leaveRequest, { foreignKey: "userId" });
db.user.hasMany(db.leaveRequest, { foreignKey: "requestToId" });
db.user.hasMany(db.userLeaveModel, { foreignKey: "userId" });

module.exports = db;