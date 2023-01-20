const { PrivateKey, Client, TokenCreateTransaction, Hbar, TokenType, TokenSupplyType, TokenAssociateTransaction, TransferTransaction, TokenPauseTransaction, TokenUnpauseTransaction } = require("@hashgraph/sdk");

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b657004220420a9af4876a155c937c51aea15c1c8abb1f45f43290e0ff25d0a2cd0a1b7ff735b")
const account1Id = "0.0.49352329"

// Acount 2
const account2 = PrivateKey.fromString("302e020100300506032b657004220420d9b0ee9ecb9009f03937f3a516723cfc031cb3b5137f67ab7caed4d34ef5ae4e")
const account2Id = "0.0.49352330"

// Acount 3
const account3 = PrivateKey.fromString("302e020100300506032b6570042204202da38135dfe14dbc3385309cb37429ed5b72035fad0a0646ce7ba2fff5b122a9")
const account3Id = "0.0.49352332"

// Acount 4
const account4 = PrivateKey.fromString("302e020100300506032b657004220420e6f71a5947106e351adb3ff22d05efae7dae84741d8e926dd4400fa6b0303ef3")
const account4Id = "0.0.49352333"

const client = Client.forTestnet();
client.setOperator(account1Id, account1);
client.setDefaultMaxTransactionFee(new Hbar(100));

async function createToken() {
    const tx = await new TokenCreateTransaction()
        .setTokenName("Cert Token")
        .setTokenSymbol("CT")
        .setTokenType(TokenType.FungibleCommon)
        .setSupplyType(TokenSupplyType.Finite)
        .setInitialSupply(35050)
        .setMaxSupply(50000)
        .setDecimals(2)
        .setTreasuryAccountId(account1Id)
        .setAdminKey(account1)
        .setPauseKey(account1)
        .setSupplyKey(account2)
        .freezeWith(client)
        .sign(account1);

    const txSubmit = await tx.execute(client);
    const receipt = await txSubmit.getReceipt(client);
    console.log(`Created token: ${receipt.tokenId}`);
    return receipt.tokenId.toString();
}

async function allowRecive(tokenId, accountId, accountKey) {
    const tx = await new TokenAssociateTransaction()
        .setAccountId(accountId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(accountKey);

    const txSubmit = await tx.execute(client);
    return await txSubmit.getReceipt(client)
}

async function transferTokens(tokenId, accountId, amount) {
    const tx = await new TransferTransaction()
        .addTokenTransfer(tokenId, account1Id, -amount)
        .addTokenTransfer(tokenId, accountId, amount)
        .execute(client);

    const txSubmit = await tx.getReceipt(client);
    return txSubmit
}

async function pauseToken(tokenId) {
    await new TokenPauseTransaction({ tokenId }).execute(client)
}

async function unPauseToken(tokenId) {
    await new TokenUnpauseTransaction({ tokenId }).execute(client)
}

async function main() {
    let token_id = await createToken();
    // let token_id = "0.0.49354505";

    // Allow account3 and account4 to recive token
    await allowRecive(token_id, account3Id, account3);
    await allowRecive(token_id, account4Id, account4);

    // Transfer 25.25 tokens to account3 and account4
    console.log(`Token transfer to ${account3Id}`)
    await transferTokens(token_id, account3Id, 2525)
    console.log(`Token transfer to ${account4Id}`)
    await transferTokens(token_id, account4Id, 2525)


    // Pause token
    console.log('Pausing token')
    await pauseToken(token_id)

    // this fails
    console.log(`Token transfer to ${account3Id}`)
    await transferTokens(token_id, account3Id, 135).catch((error) => console.log(`Error: ${error}`));

    // Unpause token
    console.log('Unpausing token')
    await unPauseToken(token_id)

    // this doesn't fail
    console.log(`Token transfer to ${account3Id}`)
    await transferTokens(token_id, account3Id, 135).catch((error) => console.log(error));
    process.exit()
}

main()