module.exports = (sequelize,DataTypes) =>{

    const leaveRequest = sequelize.define('leaveRequests', {
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
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        requestToId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        leaveType: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['Full Day', 'First Half', 'Second Half']
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['Pending', 'Approved', 'Rejected'],
            defaultValue: 'Pending'
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

    leaveRequest.associate = function(models) {
        leaveRequest.belongsTo(models.users, {
            foreignKey: 'userId',
            as: 'user',
            onDELETE: 'CASCADE',
        });

        leaveRequest.belongsTo(models.users, {
            foreignKey: 'requestToId',
            as: 'requestedUser',
            onDELETE: 'CASCADE',
        })
    };

    
    return leaveRequest;
}