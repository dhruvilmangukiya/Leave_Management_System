module.exports = (sequelize,DataTypes) =>{

    const role = sequelize.define('roles', {
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey:true
        },
        name: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    
    return role;
}