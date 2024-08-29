const nodemailer = require('nodemailer');

const sendUserEmail = async (user, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: 'prem.shankar@antiersolutions.com', // Replace with your Gmail address
        pass: 'rwer umuv jlgk wino' // Replace with your Gmail password or app-specific password
      }
    });

    const mailOptions = {
      from: '"Antier Solutions Pvt. Ltd." <prem.shankar@antiersolutions.com>', // Replace with your sender address
      to: user.email, // Recipient's email
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html // HTML body
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Could not send welcome email');
  }
};

module.exports = {sendUserEmail};






















// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   secure: true,
//   port: 465,
//   auth: {
//     user: 'prem.shankar@antiersolutions.com', // Your Gmail address
//     pass: 'rwer umuv jlgk wino' // Your Gmail password or app-specific password
//   }
// });

// const sendEmail = async (req, res, next) => {
//     try {
//       const { email, name } = req.body;
//       console.log('Request Body:', req.body);
//       const mailOptions = {
//         from: "prem.shankar@antiersolutions.com", // Sender address
//         to: email, // Recipient's email
//         subject: 'Welcome to My Registration Portal', // Subject line
//         text: `Hello ${name},\n\nThank you for registering at My App!`, // Plain text body
//         html: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for registering at My App!</p>` // HTML body
//       };
  
//     //   // Send the email using Nodemailer
//     //   let info = await transporter.sendMail(mailOptions);
  
//     //   console.log('Message sent: %s', info.messageId);
//     //   console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           return console.log('Error:', error);
//         }
//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//         next();
//       });
      
  
//       next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//       console.error('Error sending email:', error);
//       res.status(500).json({ error: 'Error sending email' });
//     }
//   };
  
// module.exports = {sendEmail}
