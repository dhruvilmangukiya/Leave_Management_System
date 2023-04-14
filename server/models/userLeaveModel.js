module.exports = (sequelize,DataTypes) =>{

    const userLeaveModel = sequelize.define('userLeaveModels', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalLeave: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 12
        },
        availableLeave: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 12
        },
        usedLeave:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        academicYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: new Date().getFullYear()
        },
        totalWorkingDays: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 300
        },
        attendancePercentage: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 100
        },
        createdAt:{
            type: DataTypes.DATE,
            defaultValue: new Date()
        },
        updatedAt:{
            type: DataTypes.DATE,
            defaultValue: new Date()
        }
    });

    userLeaveModel.associate = function(models) {
        userLeaveModel.belongsTo(models.users, {
            foreignKey: 'userId',
            as: 'user',
            onDELETE: 'CASCADE',
        });
    };
    
    return userLeaveModel;
}