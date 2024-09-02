// producer.js
const amqp = require('amqplib');


async function produce() {
  try {
    console.log("This is Product Producer")

    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'producer';
    const routingKey = 'info';
    var msg ='';

    // Declare an exchange
    await channel.assertExchange(exchange, 'direct', { durable: true });

    for(let i=1; i<=100000; i++){
        msg = 'Hello RabbitMQ with Exchange!'+i;

        // Publish a message to the exchange with the routing key
        channel.publish(exchange, routingKey, Buffer.from(msg), { persistent: true });
    }

    console.log(` [x] Sent '${msg}' to exchange '${exchange}' with routing key '${routingKey}'`);

    // Close the connection and exit
    // setTimeout(() => {
    //   channel.close();
    //   connection.close();
    // }, 500);
  } catch (error) {
    console.error('Error in producer:', error);
  }
}
produce();

