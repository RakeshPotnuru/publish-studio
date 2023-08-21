import amqp from "amqplib";

import defaultConfig from "../config/app.config";

const rabbitmqUrl = defaultConfig.rabbitmqUrl;

export const rabbitMQConnection = async () => {
    try {
        const connection = await amqp.connect(rabbitmqUrl);
        if (connection) {
            return connection;
        } else {
            console.log("❌ Failed to connect to RabbitMQ 🐇");

            return null;
        }
    } catch (error) {
        console.log(error);

        return null;
    }
};

await rabbitMQConnection()
    .then(() => console.log("✅ Connected to RabbitMQ 🐇"))
    .catch(error => {
        console.log(error);
    });
