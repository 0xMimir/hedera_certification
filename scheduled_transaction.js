const { PrivateKey, Transaction, TransferTransaction, Hbar, ScheduleCreateTransaction, Client } = require("@hashgraph/sdk")

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b657004220420a9af4876a155c937c51aea15c1c8abb1f45f43290e0ff25d0a2cd0a1b7ff735b")
const account1Id = "0.0.49352329"

// Acount 2
const account2 = PrivateKey.fromString("302e020100300506032b657004220420d9b0ee9ecb9009f03937f3a516723cfc031cb3b5137f67ab7caed4d34ef5ae4e")
const account2Id = "0.0.49352330"

const client = Client.forTestnet()
    .setOperator(account2Id, account2);


async function scheduleTransaction() {
    const tx = new TransferTransaction()
        .addHbarTransfer(account1Id, new Hbar(-10))
        .addHbarTransfer(account2Id, new Hbar(10));

    const txBytes = new ScheduleCreateTransaction()
        .setScheduledTransaction(tx)
        .setAdminKey(account1)
        .freezeWith(client)
        .toBytes();

    const base64Tx = Buffer.from(txBytes).toString('base64');
    console.log(`Base64 encoded tx: ${base64Tx}`) 
    return base64Tx
}

async function deserializeTransaction(base64Tx){
    const tx = await Transaction.fromBytes(Buffer.from(base64Tx, 'base64'))
        .sign(account1);

    await tx.execute(client)
    console.log(`\nTransaction: ${tx.transactionId}`)
}

async function main() {
    const serializedTx = await scheduleTransaction();
    await deserializeTransaction(serializedTx);
    process.exit()
}


main()