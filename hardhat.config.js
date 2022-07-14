require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("dotenv").config()

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      //accounts: [process.env.PRIVATE_KEY]
    },
    hardhat: {
      chainId: 1337
    }
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_KEY}`
  }
};
