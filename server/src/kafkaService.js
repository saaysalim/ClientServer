import { Kafka, logLevel } from 'kafkajs';

class KafkaService {
  constructor({ clientId, brokers, topic }) {
    this.clientId = clientId || 'clientserver-app';
    this.brokers = Array.isArray(brokers) ? brokers : ['localhost:9092'];
    this.topic = topic || 'media-center-collaborations';

    this.kafka = null;
    this.producer = null;
    this.consumer = null;
    this.connected = false;
  }

  async initialize() {
    try {
      this.kafka = new Kafka({
        clientId: this.clientId,
        brokers: this.brokers,
        logLevel: logLevel.ERROR,
      });

      this.producer = this.kafka.producer();
      this.consumer = this.kafka.consumer({ groupId: `${this.clientId}-group` });

      await this.producer.connect();
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const key = message.key?.toString() || 'unknown';
          const value = message.value?.toString() || '{}';
          console.log(`📨 Kafka message received [${topic}/${partition}] key=${key} payload=${value}`);
        },
      });

      this.connected = true;
      console.log(`✅ Kafka connected: ${this.brokers.join(', ')} (topic: ${this.topic})`);
      return { success: true };
    } catch (error) {
      this.connected = false;
      console.warn(`⚠️ Kafka unavailable, continuing without broker: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  isReady() {
    return this.connected && !!this.producer;
  }

  async publishEvent(eventType, payload) {
    if (!this.isReady()) {
      return { success: false, skipped: true, reason: 'Kafka not connected' };
    }

    try {
      const message = {
        key: eventType,
        value: JSON.stringify({
          eventType,
          timestamp: new Date().toISOString(),
          ...payload,
        }),
      };

      await this.producer.send({
        topic: this.topic,
        messages: [message],
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async disconnect() {
    const tasks = [];

    if (this.consumer) {
      tasks.push(this.consumer.disconnect());
    }

    if (this.producer) {
      tasks.push(this.producer.disconnect());
    }

    await Promise.allSettled(tasks);
    this.connected = false;
  }
}

export default KafkaService;
