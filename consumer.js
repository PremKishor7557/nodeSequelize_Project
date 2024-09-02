const amqp = require('amqplib');

async function consume() {
  try {
    console.log("This is Product Consumer")

    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'producer';
    const queue = 'consumerqueue';
    const routingKey = 'info';

    // Declare an exchange
    await channel.assertExchange(exchange, 'direct', { durable: true });

    // Declare a queue
    await channel.assertQueue(queue, { durable: true });

    // Bind the queue to the exchange with the routing key
    await channel.bindQueue(queue, exchange, routingKey);

    console.log(` [*] Waiting for messages in queue '${queue}' bound to exchange '${exchange}' with routing key '${routingKey}'. To exit press CTRL+C`);

    // Consume messages from the queue
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(` [x] Received '${msg.content.toString()}'`);
        channel.ack(msg);
      }else{
        console.log("All messages are consumed");
      }
    });
  } catch (error) {
    console.error('Error in consumer:', error);
  }
}
consume();
