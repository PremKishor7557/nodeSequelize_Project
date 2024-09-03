const amqp = require('amqplib');
const sendEmail = require('./helpers/emailHelper');

async function consume() {
  try {
    console.log("This is Email Consumer");

    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'Email Notifications';  // Use the same exchange name as in the producer
    const queue = 'EmailNotificationsQueue';     // Create a queue specifically for welcome emails
    const routingKey = 'EmailNotificationsKey';      // This routing key matches the one used by the producer for welcome emails

    // Declare an exchange
    await channel.assertExchange(exchange, 'direct', { durable: true });

    // Declare a queue
    await channel.assertQueue(queue, { durable: true });

    // Bind the queue to the exchange with the routing key
    await channel.bindQueue(queue, exchange, routingKey);

    //console.log(` [*] Waiting for welcome email messages in queue '${queue}' bound to exchange '${exchange}' with routing key '${routingKey}'.`);

    // Consume messages from the queue
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const messageContent = JSON.parse(msg.content.toString());
        console.log(`Received welcome email message for ${messageContent.email}`);
        console.log('Message type:', messageContent.type);
        console.log('Message content:', messageContent.content);
        // Here you can implement logic to send the email using your email service
        handleTask(messageContent);
        channel.ack(msg);
      }
    });
    console.log("Consuming started...");
  } catch (error) {
    console.error('Error in consumer:', error);
  }
}


function handleTask(task) {
  switch (task.type) {
    case 'welcomeMessage':
      sendWelcomeMessage(task.name,task.email, task.content);
      break;
    case 'verifyEmailOtp':
      sendOTP(task.name,task.email, task.content,task.otp);
      break;
    case 'verifyEmailLink':
      sendVerificationLink(task.name,task.email, task.content, task.verificationToken);
      break;
    default:
      console.log("Unknown task type:", task.type);
  }
}

async function sendWelcomeMessage(name, email, content) {
  // Implement logic to send a welcome email
  console.log(`Sending welcome message to ${email}: ${content}`);
  // Use your email service (e.g., Nodemailer) to send the email

        // Send a welcome email to the user
        let subject = 'Welcome to Registration Portal'; // Subject line
        let text = `Hello ${name},\n\nThank you for registering at My App!,\n\nBest regards,\nAntier Solutions Pvt. Ltd.`; // Plain text body
        let html = `<p>Hello <strong>${name}</strong>,</p><p>Thank you for registering at My App!</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
        await sendEmail.sendEmailQueue(email, subject, text, html);
}

async function sendOTP(name, email, content, otp) {
  // Implement logic to send OTP email
  console.log(`Sending OTP to ${email}: ${content}`);
  // Use your email service to send the email

  // Send OTP email
  let subject = 'Your OTP Code'; // Subject line
  let text = `${content}${otp}. It expires in 30 minutes.`; // Plain text body
  let html = `<p>Hello <strong>${name}</strong>,</p><p>${content}${otp}. It expires in 30 minutes.</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
  await sendEmail.sendEmailQueue(email, subject, text, html);
}

async function sendVerificationLink(name, email, content, verificationToken) {
  // Implement logic to send email verification link
  console.log(`Sending verification link to ${email}: ${content}`);
  // Use your email service to send the email

   // Send verification link email
   const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}&email=${email}`;
   subject = 'Email Verification Link'; // Subject line
   text = `Click on this link to verify your email: ${verificationLink}. It expires in 30 minutes.`; // Plain text body
   html = `<p>Hello <strong>${name}</strong>,</p><p>Click on this link to verify your email: ${verificationLink}. It expires in 30 minutes.</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
   await sendEmail.sendEmailQueue(email, subject, text, html);
}

consume();