const crypto = require('crypto');
const sendEmail = require('../helpers/emailHelper');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex'); // Generate a random verification token
};

const sendVerificationEmail = async (user) => {
    // Send OTP email
    let subject = 'Your OTP Code'; // Subject line
    let text = `Your OTP code is ${user.otp}. It expires in 30 minutes.`; // Plain text body
    let html = `<p>Hello <strong>${user.name}</strong>,</p><p>Your OTP code is ${user.otp}. It expires in 30 minutes.</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
    await sendEmail.sendUserEmail(user, subject, text, html);

    // Send verification link email
    const verificationLink = `http://your-domain.com/verify-email?token=${user.verificationToken}&email=${user.email}`;
    subject = 'Email Verification Link'; // Subject line
    text = `Click on this link to verify your email: ${verificationLink}. It expires in 30 minutes.`; // Plain text body
    html = `<p>Hello <strong>${user.name}</strong>,</p><p>Click on this link to verify your email: ${verificationLink}. It expires in 30 minutes.</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
    await sendEmail.sendUserEmail(user, subject, text, html);
};


module.exports = {generateOTP, generateVerificationToken, sendVerificationEmail}





// const sendVerificationEmail = async (user) => {
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.ethereal.email',
//         port: 587,
//         auth: {
//             user: 'your_ethereal_email@example.com', // replace with your Ethereal email
//             pass: 'your_ethereal_password' // replace with your Ethereal password
//         }
//     });

//     // Send OTP email
//     await transporter.sendMail({
//         from: '"Your Company" <no-reply@yourcompany.com>',
//         to: user.email,
//         subject: 'Your OTP Code',
//         text: `Your OTP code is ${user.otp}. It expires in 30 minutes.`,
//     });

//     // Send verification link email
//     const verificationLink = `http://your-domain.com/verify-email?token=${user.verificationToken}&email=${user.email}`;
//     await transporter.sendMail({
//         from: '"Your Company" <no-reply@yourcompany.com>',
//         to: user.email,
//         subject: 'Email Verification Link',
//         text: `Click on this link to verify your email: ${verificationLink}. It expires in 30 minutes.`,
//     });
// };
