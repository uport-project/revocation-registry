#!/usr/local/bin/node

const ethers = require('ethers')
const registry = require('../build/contracts/RevocationRegistry.json')

const gasLimits = {
  RevocationRegistry: 189751, // If this value needs to be recalculated, it can be done by deploying the rawTx once and looking at gasUsed in the receipt
}

generateDeployTx = (code, name) => {
  const txInputs = {
    nonce: 0,
    gasPrice: 10000000000, // 10 Gwei
    gasLimit: gasLimits[name] || 2000000,
    value: 0,
    data: code,
  }
  const sig = ethers.utils.joinSignature({
    v: 27,
    r: '0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798',
    s: '0x0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  })

  const rawTx = ethers.utils.serializeTransaction(txInputs, sig)
  const tx = ethers.utils.parseTransaction(rawTx)

  console.log(tx)
  
  // // const tx = new Transaction(rawTx)
  const res = {
    senderAddress: tx.from,
    rawTx: rawTx,
    costInEther: ethers.utils.formatEther(tx.gasPrice.mul(tx.gasLimit)),
    contractAddress: ethers.utils.getContractAddress(tx)
  }
  return res
}

generateAll = () => {
  let deployData = {}
  // for (const file of ls('./build/contracts/*')) {
  // if (file.name === 'Migrations') continue
  // const artifact = require(process.cwd() + file.full.slice(1))
  deployData[registry.contractName] = generateDeployTx(registry.bytecode, registry.contractName)
  // }
  return deployData
}

module.exports = generateAll

if (require.main === module) {
  const deployData = generateAll()
  for (const name in deployData) {
    console.log('\n\x1b[31m ======= Contract:', name, '=======\x1b[0m')
    console.log('\x1b[34mrawTx:\x1b[0m', deployData[name].rawTx)
    console.log('\x1b[34msenderAddress:\x1b[0m', deployData[name].senderAddress)
    console.log('\x1b[34mcost (ether):\x1b[0m', deployData[name].costInEther)
    console.log('\x1b[34mcontractAddress:\x1b[0m', deployData[name].contractAddress)
  }
}