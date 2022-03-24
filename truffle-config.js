
const HDWalletProvider = require('@truffle/hdwallet-provider');
//
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync(".secret.json").toString().trim());
const infuraKey = secret.projectId;
const mnemonic = secret.mnemonic;
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // rinkby's id
      gas: 4500000,        // rinkby has a lower block limit than mainnet
      gasPrice: 10000000000
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraKey}`),
      network_id: 42,       // kovan's id
      gas: 4500000,        // kovan has a lower block limit than mainnet
      gasPrice: 10000000000
    },
  },
  mocha: {
    timeout: 100000
  },
  compilers: {
    solc: {
      version: "^0.4.24",
    }
  }
};