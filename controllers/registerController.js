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

// var postEditUser = async (req, res) =>{
//     try {
//         const userId = req.params.id;
//         const user = await addUser.findByPk(userId);
//         const updatedData = {
//             name: req.body.name,
//             email: req.body.email,
//             mobile: req.body.mobile,
//             dob: req.body.dob,
//             address: req.body.address,
//             image: req.file ? req.file.filename : req.body.currentImage  // Handle file upload
//         };

//         //const user = await addUser.findByPk(userId);

//         if (user) {
//             await addUser.update(updatedData);
//             //res.redirect(`/edit/${userId}`);  // Redirect to the edit page or any other page after update
//             console.log('User updated successfully:', user);
//             return user;  // Return the updated user
//         } else {
//             res.status(404).send('User not found');
//         }
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).send('Server error');
//     }
// }

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

// var postEditUser = async (req, res) =>{
//     const userId = req.params.id;
//    //const { name, email, mobile, dob, address, image } = req.body;
//    //console.log("Updating user with ID:", userId);
//    //console.log("Data received:", { name, email, mobile, dob, address, image });
//    var updatedData = req.body;
//   try {
//     // Update the user record
//     const [updated] = await addUser.update(
//         updatedData,
//       {
//         where: { id: userId },
//       }
//     );

//     if (updated) {
//       const updatedUser = await addUser.findOne({ where: { id: userId } });
//       res.status(200).json({ message: 'User updated successfully', user: updatedUser });
//     } else {
//       res.status(404).json({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'An error occurred while updating the user' });
//   }
// }

// var postEditUser= async (req, res) => {
//     try {
//         const userid = req.params.id
//       const user = await addUser.findByPk(userid);
//       if (user) {
//         await user.update(req.body,{
//             where:{
//                 id:userid
//             }
//         }); // Update user data with the form data
//         res.redirect(`/user/${user.id}/edit`); // Redirect to the edited form page or another appropriate page
//       } else {
//         res.status(404).send('User not found');
//       }
//     } catch (error) {
//       res.status(500).send('Server error');
//     }
//   }

var getListUser = async (req, )
module.exports = {
    registerUser,
    upload,
    getEditUser,
    postEditUser
};