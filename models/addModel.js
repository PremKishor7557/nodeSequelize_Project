module.exports = (sequelize,DataTypes,Model) =>{
    class Adduser extends Model {}
    
    Adduser.init(
      {
        // Model attributes are defined here
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          //unique: true,
        },
        email: {
          type: DataTypes.STRING,
          //defaultValue: 'Singh',
          // allowNull defaults to true
        },
        mobile: {
            type: DataTypes.INTEGER
        },
        dob: {
            type: DataTypes.DATE
        },
        address: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.BLOB
        }
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Adduser', // We need to choose the model name
      },
    );
    return Adduser;
    }