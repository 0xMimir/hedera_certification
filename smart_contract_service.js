const { PrivateKey, Client, Hbar, ContractCreateFlow, ContractExecuteTransaction, ContractFunctionParameters,
    ContractCallQuery
} = require("@hashgraph/sdk");

// Acount 1
const account1 = PrivateKey.fromString("302e020100300506032b657004220420a9af4876a155c937c51aea15c1c8abb1f45f43290e0ff25d0a2cd0a1b7ff735b")
const account1Id = "0.0.49352329"

const client = Client.forTestnet();
client.setOperator(account1Id, account1);
client.setDefaultMaxTransactionFee(new Hbar(100));

const contractJson = require("./CertificationC1.json");

async function deployContract() {
    const contractTx = await new ContractCreateFlow()
        .setBytecode(contractJson.bytecode)
        .setGas(100_000_000)
        .execute(client);

    const contractId = (await contractTx.getReceipt(client)).contractId;
    return contractId
}

async function interactWithContractFunction1(contractId) {
    const tx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100_000)
        .setFunction("function1", new ContractFunctionParameters().addUint16(6).addUint16(7))
        .execute(client);

    return Buffer.from((await tx.getRecord(client)).contractFunctionResult.bytes).toJSON().data.at(-1)
}

async function interactWithContractFunction2(contractId, n) {
    const tx = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100_000)
        .setFunction("function2", new ContractFunctionParameters().addUint16(n))
        .execute(client);

    return Buffer.from((await tx.getRecord(client)).contractFunctionResult.bytes).toJSON().data.at(-1)
}

async function main() {
    // let contractId = await deployContract();
    let contractId = "0.0.49399554";
    let result1 = await interactWithContractFunction1(contractId);
    let result2 = await interactWithContractFunction2(contractId, result1);
    console.log(result2)

    process.exit()
}

main()