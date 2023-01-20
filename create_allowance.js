const { TransferTransaction, Hbar, HbarUnit, Client, AccountAllowanceApproveTransaction, PrivateKey, AccountId, TransactionId, AccountBalanceQuery } = require("@hashgraph/sdk")

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b657004220420a9af4876a155c937c51aea15c1c8abb1f45f43290e0ff25d0a2cd0a1b7ff735b")
const account1Id = "0.0.49352329"

// Acount 2
const account2 = PrivateKey.fromString("302e020100300506032b657004220420d9b0ee9ecb9009f03937f3a516723cfc031cb3b5137f67ab7caed4d34ef5ae4e")
const account2Id = "0.0.49352330"

const client = Client.forTestnet();
client.setOperator(account2Id, account2);
client.setDefaultMaxTransactionFee(new Hbar(10));

async function createAllowance() {
    const tx = await new AccountAllowanceApproveTransaction()
        .approveHbarAllowance(account1Id, account2Id, new Hbar(20))
        .freezeWith(client)
        .sign(account1);

    const allowanceSubmit = await tx.execute(client);
    return await allowanceSubmit.getReceipt(client);
}

async function main() {
    await createAllowance();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    process.exit()
}

main().catch((error) => console.log(`Error: ${error}`))