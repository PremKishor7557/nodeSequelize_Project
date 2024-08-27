module.exports = (sequelize,DataTypes,Model) =>{
    class jwtUser extends Model {}
    
    jwtUser.init(
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
        password: {
            type: DataTypes.STRING,
            //allowNull: false,
        },
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'jwtUser', // We need to choose the model name
      },
    );
    return jwtUser;
    }