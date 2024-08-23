module.exports=(sequelize, DataTypes)=>{

    const Contact = sequelize.define(
        'contacts',
      {
        // Model attributes are defined here
        permanent_address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        current_address: {
          type: DataTypes.STRING,
          // allowNull defaults to true
        },
        //user_id:DataTypes.INTEGER
    },
      {
        // Other model options go here
      },
    );
    return Contact;
    }
    