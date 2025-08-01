const amqp = require('amqplib');
const Patient = require('./src/models/patientModel'); // Adjust path if needed

const RABBITMQ_HOST = 'amqp://localhost';
const EXCHANGE_NAME = 'denti_code_events';
const QUEUE_NAME = 'patient_service_queue';
const BINDING_KEY = 'user.registered';

async function processMessage(msg) {
  if (msg !== null) {
    try {
      const message = JSON.parse(msg.content.toString());
      console.log(`[ consumer ] Received event: ${BINDING_KEY}`);
      console.log('[ consumer ] Processing message:', message);

      // --- Core Logic: Create a patient from the event data ---
      const patientData = {
        FirstName: message.firstName,
        LastName: message.lastName,
        Email: message.email,
        AuthUserID: message.userId, // The crucial link
        // You might need to add default/placeholder values for other required fields
        DateOfBirth: '1900-01-01', // Placeholder
        ContactPhone: `placeholder-${Date.now()}`, // Placeholder, must be unique
      };

      // Using a Promise wrapper for the callback-based model
      await new Promise((resolve, reject) => {
        Patient.create(patientData, (err, result) => {
          if (err) {
            console.error('[ consumer ] Error creating patient:', err.message);
            // In a real app, you would handle this more gracefully (e.g., dead-letter queue)
            return reject(err);
          }
          console.log(`[ consumer ] Patient created successfully with ID: ${result.id}`);
          resolve(result);
        });
      });

      // Acknowledge the message to remove it from the queue
      return true;
    } catch (error) {
      console.error('[ consumer ] Failed to process message:', error);
      // Return false to indicate failure, so the message is not acknowledged
      return false;
    }
  }
  return true; // No message to process
}

async function startConsuming() {
  console.log('[ consumer ] Starting...');
  try {
    const connection = await amqp.connect(RABBITMQ_HOST);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
    const q = await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`[ consumer ] Waiting for events with key '${BINDING_KEY}'. To exit press CTRL+C`);
    await channel.bindQueue(q.queue, EXCHANGE_NAME, BINDING_KEY);

    channel.consume(q.queue, async (msg) => {
      console.log(msg)
      const success = await processMessage(msg);
      if (success) {
        channel.ack(msg); // Acknowledge the message
      } else {
        // Reject the message but don't requeue it to avoid infinite loops on bad data
        channel.nack(msg, false, false);
      }
    });
  } catch (error) {
    console.error('[ consumer ] Error starting consumer:', error.message);
    console.log('[ consumer ] Retrying in 5 seconds...');
    setTimeout(startConsuming, 5000); // Retry connection after 5 seconds
  }
}

startConsuming();