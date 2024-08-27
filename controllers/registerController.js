var db = require('../models/index')
const multer = require('multer')
const path = require('path');
var addUser = db.addUser;

//const upload = multer({dest: "upload/"});
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,path.join(__dirname, '../public/images'));
    },
    filename:function(req,file,cb){
        const name = `${Date.now()}`+`-`+`${file.originalname}`;
        return cb(null,name);
    }
});
const upload = multer({storage});
var registerUser = async (req, res) => {
    try {
        const { name, email, mobile, dob, address } = req.body;

        // Create a new user record
        const newUser = await addUser.create({ 
            name : name,
            email : email,
            mobile : mobile,
            dob : dob,
            address : address,
            image : req.file.filename
        });
        //console.log(newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

var getEditUser = async (req, res) =>{
    try {
        const userId = req.params.id;
        const user = await addUser.findByPk(userId);
        
        if (user) {
            res.render('edituser', { sampleData: user });  // Render the EJS template with user data
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
}

var postEditUser = async (req, res) =>{
    const userId = req.params.id;
    const { name, email, mobile, dob, address, image } = req.body;
   console.log("Updating user with ID:", userId);
   console.log("Data received:", { name, email, mobile, dob, address, image });
  try {
    // Update the user record
    const [updated] = await addUser.update(
      {
        name,
        email,
        mobile,
        dob,
        address,
        image,
      },
      {
        where: { id: userId },
      }
    );

    if (updated) {
      const updatedUser = await addUser.findOne({ where: { id: userId } });
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the user' });
  }
}

var getListUser = async (req, res) => {
    try {
      const users = await addUser.findAll(); // Fetch all users from the database
      res.render('listuser', { users }); // Pass users data to the 'users.ejs' template
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    }
}

//enctype="application/x-www-form-urlencoded"

module.exports = {
    registerUser,
    upload,
    getEditUser,
    postEditUser,
    getListUser
};