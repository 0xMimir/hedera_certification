const { TransferTransaction, Hbar, HbarUnit, Client, AccountAllowanceApproveTransaction, PrivateKey, AccountId, TransactionId, AccountBalanceQuery } = require("@hashgraph/sdk")

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b657004220420a9af4876a155c937c51aea15c1c8abb1f45f43290e0ff25d0a2cd0a1b7ff735b")
const account1Id = "0.0.49352329"

// Acount 2
const account2 = PrivateKey.fromString("302e020100300506032b657004220420d9b0ee9ecb9009f03937f3a516723cfc031cb3b5137f67ab7caed4d34ef5ae4e")
const account2Id = "0.0.49352330"

// Acount 3
const account3 = PrivateKey.fromString("302e020100300506032b6570042204202da38135dfe14dbc3385309cb37429ed5b72035fad0a0646ce7ba2fff5b122a9")
const account3Id = "0.0.49352332"


const client = Client.forTestnet();
client.setOperator(account2Id, account2);
client.setDefaultMaxTransactionFee(new Hbar(10));

async function spendAllowance() {
    const approvedSendTx = await new TransferTransaction()
        .addApprovedHbarTransfer(account1Id, new Hbar(-20))
        .addHbarTransfer(account3Id, new Hbar(20))
        .setTransactionId(TransactionId.generate(account2Id))
        .freezeWith(client)
        .sign(account2);

    const approvedSendSubmit = await approvedSendTx.execute(client);
    return await approvedSendSubmit.getReceipt(client);
}

async function printBalance(accountId) {
    let balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountId).execute(client);
    console.log(`- Account ${accountId}: ${balanceCheckTx.hbars.toString()}`);
}

async function main() {
    await spendAllowance();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await printBalance(account1Id);
    await printBalance(account2Id);
    await printBalance(account3Id);
    process.exit()
}

main().catch((error) => console.log(`Error: ${error}`))