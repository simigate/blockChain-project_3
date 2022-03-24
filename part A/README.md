Requirement 1: Project write-up - UML
-------------------------------------

Added : string ipfsHash

Added two additional functions in SupplyChain.sol : upload() and read()

Requirement 2: Project write-up - Libraries
-------------------------------------------

@truffle/contract ^4.5.1 : in browser javascript for Better Ethereum contract abstraction

@truffle/hdwallet-provider ^2.0.4 : in truffle-config.js to use truffleHD Wallet-enabled Web3 provider

bignumber.js ^9.0.2 : in browser javascript for converting solidity uint256 to javascript 

web3 ^1.7.1 : in browser javascript to interact with a local or remote ethereum node

buffer : in browser javascript provides a way of handling streams of binary data

ipfs-api : in browser javascript to upload image to ipfs

Requirement 3: Project write-up - IPFS
---------------------------------------

ipfs-api is used to upload image from browser using a local ipfsnode 

const ipfs = window.IpfsApi('/ip4/127.0.0.1/tcp/5001')
