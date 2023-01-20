const { Client, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction, AccountId, Hbar } = require("@hashgraph/sdk");

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b657004220420a9af4876a155c937c51aea15c1c8abb1f45f43290e0ff25d0a2cd0a1b7ff735b")
const account1Id = "0.0.49352329"

const client = Client.forTestnet()
    .setOperator(account1Id, account1)
    .setDefaultMaxTransactionFee(new Hbar(10));

async function createTopic() {
    let txResponse = await new TopicCreateTransaction().execute(client);
    let receipt = await txResponse.getReceipt(client);
    return receipt.topicId.toString()
}

async function send_message(topicId) {
    const message = new Date().toISOString();

    const response = await new TopicMessageSubmitTransaction({
        topicId,
        message
    }).execute(client);

    let receipt = await response.getReceipt(client);
    console.log(`\nSent message to topic: ${topicId}, message: ${message}`);
    return receipt.status.toString()
}

async function main() {
    let topicId = await createTopic();
    console.log(`Created topic with id: ${topicId}`)
    console.log(`Look at topic messages: https://hashscan.io/testnet/topic/${topicId}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await send_message(topicId);
    process.exit()
}

main();