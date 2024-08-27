module.exports = (sequelize,DataTypes,Model) =>{
    class addUser extends Model {}
    
    addUser.init(
      {
        // Model attributes are defined here
        name: {
          type: DataTypes.STRING,
          //allowNull: false,
          //unique: true,
        },
        email: {
          type: DataTypes.STRING,
          //allowNull: false,
          //defaultValue: 'Singh',
          // allowNull defaults to true
        },
        mobile: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        dob: {
            type: DataTypes.DATEONLY,
            //allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          //allowNull: false,
        },
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'addUser', // We need to choose the model name
      },
    );
    return addUser;
    }