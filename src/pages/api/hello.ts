import * as ethers from "ethers";
import * as fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";
import * as solc from "solc";

const infuraApiKey = process.env.INFURA_API_KEY || "";
const walletPrivateKey = process.env.WALLET_PRIVATE_KEY || "";

const findImports = (importPath: string) => {
  if (importPath.startsWith("@openzeppelin")) {
    const openZeppelinPath = path.resolve("node_modules", importPath);
    return { contents: fs.readFileSync(openZeppelinPath, "utf8") };
  } else {
    return { error: `File not found: ${importPath}` };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const source = req.body.contract;
  const contractNameRegex = /contract\s+(\w+)\s*([^{]*)\{/;
  const match = contractNameRegex.exec(source);
  const contractName = match && match[1] ? match[1] : "";
  const sourceName = `${contractName}.sol`;

  let input: any = {
    language: "Solidity",
    sources: {},
    settings: { outputSelection: { "*": { "*": ["*"] } } },
  };
  input.sources[sourceName] = { content: source };
  const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: findImports })
  );
  const bytecode =
    output.contracts[sourceName][contractName].evm.bytecode.object;
  const abi = output.contracts[sourceName][contractName].abi;
  const prorider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${infuraApiKey}`
  );
  const signerWallet = new ethers.Wallet(walletPrivateKey, prorider);
  const factory = new ethers.ContractFactory(abi, bytecode, signerWallet);
  const deployTransaction = factory.getDeployTransaction();
  const gasLimit = await signerWallet.estimateGas(deployTransaction);
  const gasPrice = await prorider.getGasPrice();
  const transactionFee = gasPrice.mul(gasLimit);

  res.status(200).json({ gasLimit, gasPrice, transactionFee });
}
