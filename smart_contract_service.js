const { PrivateKey, Client, Hbar, FileCreateTransaction, ContractCreateTransaction } = require("@hashgraph/sdk")

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b657004220420a9af4876a155c937c51aea15c1c8abb1f45f43290e0ff25d0a2cd0a1b7ff735b")
const account1Id = "0.0.49352329"

const client = Client.forTestnet();
client.setOperator(account1Id, account1);
client.setDefaultMaxTransactionFee(new Hbar(10));

const contractJson = require("./CertificationC1.json");


async function deployContract() {
    const tx = await new FileCreateTransaction()
        .setContents(contractJson.deployedBytecode)
        .execute(client);

    const fileId = (await tx.getReceipt(client)).fileId;
    const contractTx = await new ContractCreateTransaction()
        .setBytecodeFileId(fileId)
        .setGas(100000)
        .execute(client);
    
    const contractId = (await contractTx.getReceipt(client)).contractId;
    return contractId
}

async function main() {
    let contractId = await deployContract();
    console.log(contractId);
    process.exit()
}

main()