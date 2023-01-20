const { PrivateKey, Client, AccountCreateTransaction } = require("@hashgraph/sdk");

const treasuryAccount = PrivateKey.fromString("302e020100300506032b657004220420fd965c99f81c17f4e0d51c0d3a5d65b487d567b27072756afed89118d106e772");
const treasuryId = "0.0.49351866"

const treasuryClient = Client.forTestnet();
treasuryClient.setOperator(treasuryId, treasuryAccount);

async function createAccount(n) {
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const tx = await new AccountCreateTransaction()
        .setKey(newAccountPrivateKey)
        .setInitialBalance(1500)
        .execute(treasuryClient);

    const accountId = (await tx.getReceipt(treasuryClient)).accountId;
    console.log(`- Acount ${n}`);
    console.log(`Private key: ${newAccountPrivateKey}`);
    console.log(`Account ID: ${accountId}\n`);
}

async function main() {
    for (let i = 1; i <= 5; i++) {
        await createAccount(i);
    }

    process.exit()
}

main();