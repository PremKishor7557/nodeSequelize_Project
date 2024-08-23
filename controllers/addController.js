var db = require('../models/index')
var Adduser = db.adduser;

var addUser = async (req, res)=>{
    const jane = await Adduser.create({ name:"prem", email:"prem@gmail.com", mobile:"123456789", dob:"01-01-2000", address:"sultani"});

    console.log(jane.toJSON());
    res.status(200).json(jane.toJSON());
}

module.exports = addUser;