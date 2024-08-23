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
          type: DataTypes.email,
          defaultValue: 'Singh',
          // allowNull defaults to true
        },
        mobile: {
            type: DataTypes.mobile
        },
        dob: {
            type: DataTypes.dob
        },
        address: {
            type: DataTypes.address
        },
        image: {
            type: DataTypes.image
        }
      },
      {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name
      },
    );
    return Adduser;
    }