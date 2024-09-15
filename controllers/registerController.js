var db = require('../models/index')
const multer = require('multer')
const path = require('path');
var addUser = db.addUser;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const sendEmail = require('../helpers/emailHelper');
const emailVerifier = require('../helpers/emailVerifier');
var {redisClient, sessionMiddleware} = require('../config/radis')
const amqp = require('amqplib');
const cron = require('node-cron');
const { Op } = require('sequelize');



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
        const { name, email, mobile, dob, address, password } = req.body;

        // Check if the user already exists
        const existingUser = await addUser.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.toString(), salt);

        const otp = emailVerifier.generateOTP();
        const verificationToken = emailVerifier.generateVerificationToken();
        const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

        // Create a new user record
        const newUser = await addUser.create({ 
            name : name,
            email : email,
            mobile : mobile,
            dob : dob,
            address : address,
            image : req.file.filename,
            password : hashedPassword,
            otp: otp,
            otpExpiresAt: expirationTime,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: expirationTime
        });

        // Send a welcome email to the user
        let subject = 'Welcome to Registration Portal'; // Subject line
        let text = `Hello ${newUser.name},\n\nThank you for registering at My App!,\n\nBest regards,\nAntier Solutions Pvt. Ltd.`; // Plain text body
        let html = `<p>Hello <strong>${newUser.name}</strong>,</p><p>Thank you for registering at My App!</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
        await sendEmail.sendUserEmail(newUser, subject, text, html);

        await emailVerifier.sendVerificationEmail(newUser);
        //console.log(newUser);
        res.status(201).json({ message: 'User registered successfully and email sent on register email', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

// const registerUser = async (req, res) => {
//   let connection;
//   let channel;
//   try {
//       const { name, email, mobile, dob, address, password } = req.body;

//       // Check if the user already exists
//       const existingUser = await addUser.findOne({ where: { email } });
//       if (existingUser) {
//           return res.status(400).json({ message: 'Email already in use' });
//       }

//       // Hash the password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password.toString(), salt);

//       const otp = emailVerifier.generateOTP();
//       const verificationToken = emailVerifier.generateVerificationToken();
//       const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

//       // Create a new user record
//       const newUser = await addUser.create({
//           name: name,
//           email: email,
//           mobile: mobile,
//           dob: dob,
//           address: address,
//           image: req.file.filename,
//           password: hashedPassword,
//           otp: otp,
//           otpExpiresAt: expirationTime,
//           verificationToken: verificationToken,
//           verificationTokenExpiresAt: expirationTime
//       });

//       // RabbitMQ setup
//       const exchange = 'Email Notifications';
//       const RoutingKey = 'EmailNotificationsKey';
//       // const otpRoutingKey = 'otp_email';
//       // const verificationRoutingKey = 'verification_email';

//       connection = await amqp.connect('amqp://localhost');
//       channel = await connection.createChannel();

//       await channel.assertExchange(exchange, 'direct', { durable: true });

//       // Prepare messages
//       const welcomeMessage = {
//           "name" : newUser.name,
//           "email": newUser.email,
//           "type": "welcomeMessage",
//           "content": "Thank you for registering at My App!"
//       };

//       const otpMessage = {
//           "name" : newUser.name,
//           "email": newUser.email,
//           "type": "verifyEmailOtp",
//           "content": "Your OTP code is ",
//           "otp" : newUser.otp
//       };

//       const verificationMessage = {
//           "name" : newUser.name,
//           "email": newUser.email,
//           "type": "verifyEmailLink",
//           "content": "Click on this link to verify your email:",
//           "verificationToken": newUser.verificationToken
//       };

//       // Publish messages
//       channel.publish(exchange, RoutingKey, Buffer.from(JSON.stringify(welcomeMessage)), { persistent: true });
//       channel.publish(exchange, RoutingKey, Buffer.from(JSON.stringify(otpMessage)), { persistent: true });
//       channel.publish(exchange, RoutingKey, Buffer.from(JSON.stringify(verificationMessage)), { persistent: true });

//       res.status(201).json({ message: 'User registered successfully and email tasks have been queued', user: newUser });
//   } catch (error) {
//       console.error('Error registering user:', error);
//       res.status(500).json({ message: 'Error registering user', error: error.message });
//   } finally {
//       if (channel) await channel.close();
//       if (connection) await connection.close();
//   }
// };


// var loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await addUser.findOne({ where: { email } });

//     // Check if user exists
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Verify the password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user.id, email: user.email }, // Payload
//       process.env.JWT_SECRET, // Secret key
//       { expiresIn: '1h' } // Token expiration time
//     );

//     // Save the token in a cookie
//     res.cookie('authToken', token, {
//       httpOnly: true, // Prevents client-side JavaScript from accessing the token
//       secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
//       sameSite: 'Strict', // Prevents the cookie from being sent with cross-site requests
//     });

//     // Optionally, save the email in a separate cookie
//     res.cookie('userEmail', email, {
//       httpOnly: true, // Prevents client-side JavaScript from accessing the email
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//     });

//     // If you want to save the entire req.body in a cookie (not recommended for large payloads)
//     // res.cookie('userDetails', JSON.stringify(req.body), {
//     //   httpOnly: true,
//     //   secure: process.env.NODE_ENV === 'production',
//     //   sameSite: 'Strict',
//     // });

//     // Send a response back to the client
//     res.json({ message: 'Login successful' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

var loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await addUser.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      // Return to ensure no further code is executed after the response is sent
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Return to ensure no further code is executed after the response is sent
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Save user information in session (stored in Redis)
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.isAuthenticated = true;

    // Send a response back to the client
    res.json({ message: 'Login successful' }); // Return to ensure no further code is executed
  } catch (error) {
    // Return to ensure no further code is executed after the response is sent
    return res.status(500).json({ error: error.message });
  }
};



const getUserDetails = async (req, res) => {
  try {
    const userId = req.session.userId; // Get the user ID from the session

    // Fetch user details from the database
    const user = await addUser.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Exclude the password field
    });

    if (!user) {
      // Return here to ensure no further code is executed
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user details back to the client
    return res.json({ user }); // Return to ensure no further code is executed
  } catch (error) {
    // Return here to ensure no further code is executed
    return res.status(500).json({ error: error.message });
  }
};


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

var verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await addUser.findOne({ where: { email, otp } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or email' });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

var verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query;

        const user = await addUser.findOne({ where: { email, verificationToken: token } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or email' });
        }

        if (user.verificationTokenExpiresAt < new Date()) {
            return res.status(400).json({ message: 'Verification link expired' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Error verifying email', error: error.message });
    }
};

// Function to send reminder emails
let reminderCronJob
const sendReminderEmails = () => {
  // Schedule a job to run every minute
  reminderCronJob = cron.schedule('* * * * *', async () => {
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

    try {
      // Fetch users who haven't verified their email and registered at least 1 minute ago
      const unverifiedUsers = await addUser.findAll({
        where: {
          isVerified: false,  // User is not verified
          createdAt: {
            [Op.lt]: oneMinuteAgo  // Registered more than a minute ago
          }
        }
      });

      // Send reminder emails to each unverified user
      unverifiedUsers.forEach(async (user) => {
        const verificationLink = `${process.env.BASE_URL}/verify-email?token=${user.verificationToken}&email=${user.email}`;

        let subject= 'Reminder: Verify Your Email';
        let text= `Hi ${user.name},\n\nPlease verify your email by clicking this link: ${verificationLink}\n\nIf you didn't register, ignore this message.`;
        let html= `<p>Hi ${user.name},</p><p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p><p>If you didn't register, ignore this message.</p>`;
        await sendEmail.sendUserEmail(user, subject, text, html);

        console.log(`Sent reminder email to ${user.email}`);
      });

    } catch (error) {
      console.error('Error sending reminder emails:', error);
    }
  });
};

// Function to stop sending reminder emails
const stopReminderEmails = () => {
  if (reminderCronJob) {
    reminderCronJob.stop();
    console.log('CRON job for sending reminder emails has been stopped.');
  }
};

//enctype="application/x-www-form-urlencoded"

module.exports = {
    registerUser,
    upload,
    loginUser,
    getUserDetails,
    getEditUser,
    postEditUser,
    getListUser,
    verifyOtp,
    verifyEmail,
    sendReminderEmails,
    stopReminderEmails
};