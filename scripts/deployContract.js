const ethers = require('ethers');

const precomputedTx = '0xf902eb808502540be4008302e5378080b90298608060405234801561001057600080fd5b50610278806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063b75c7dc61461003b578063e46e384614610069575b600080fd5b6100676004803603602081101561005157600080fd5b81019080803590602001909291905050506100cb565b005b6100b56004803603604081101561007f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506101e9565b6040518082815260200191505060405180910390f35b600080600083815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541461012757600080fd5b4360008083815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f6e70be4be1a4aebd688b5523bd8b6278acac3963d71ebf2bd5ea50757047664b3382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150565b600080600083815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490509291505056fea265627a7a72315820dba492220bb488558be68ed10a1d0aedf2ce687fe3d60c323c3c94b441ba367664736f6c634300050c00321ba079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a00aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

const provider = ethers.getDefaultProvider('rinkeby');

; (async () => {
  try {
    const txResponse = await provider.sendTransaction(precomputedTx);
    console.log(txResponse);
  } catch(e) {
    let text = e.responseText || e.toString();
    if(text.toLowerCase().match('insufficient funds')) {
        const tx = ethers.utils.parseTransaction(precomputedTx);
        const senderAddress = tx.from;
        const requiredEth = ethers.utils.formatEther(tx.gasPrice.mul(tx.gasLimit));

        console.error(`Insufficient funds. The address ${senderAddress} needs to be funded with at least ${requiredEth} ether`);
    } else {
        console.error(e);
    }
  }
})();
