// https://eth-sepolia.g.alchemy.com/v2/y3rGvKmGA_Hv0yxSLX_FBnFqwGORwdwj

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/y3rGvKmGA_Hv0yxSLX_FBnFqwGORwdwj',
      accounts: ['e6285f8fb3056502fa41558da520c7f1cc627747acc0a7560f0ccac896b7bc58']
    }
  }
}