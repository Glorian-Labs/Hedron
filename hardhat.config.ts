import { config } from 'dotenv'

config()

export default {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hedera: {
      url: 'https://testnet.hashio.io/api',
      chainId: 0x128,
      accounts: process.env.HEDERA_PRIVATE_KEY ? [process.env.HEDERA_PRIVATE_KEY] : [],
      gasPrice: 100_000_000, // 100 tinybars
      gas: 1_000_000
    },
    hedera_mainnet: {
      url: 'https://mainnet-public.mirrornode.hedera.com',
      chainId: 0x127,
      accounts: process.env.HEDERA_PRIVATE_KEY ? [process.env.HEDERA_PRIVATE_KEY] : [],
      gasPrice: 100_000_000,
      gas: 1_000_000
    }
  },
  paths: {
    sources: './contracts',
    tests: './tests',
    cache: './cache',
    artifacts: './artifacts'
  }
}

