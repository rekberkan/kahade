import { registerAs } from '@nestjs/config';

export default registerAs('blockchain', () => ({
  network: process.env.BLOCKCHAIN_NETWORK || 'sepolia',
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY',
  contractAddress: process.env.SMART_CONTRACT_ADDRESS,
  privateKey: process.env.PRIVATE_KEY,
  gasLimit: parseInt(process.env.GAS_LIMIT || "3000000", 10) || 3000000,
  gasPrice: process.env.GAS_PRICE || undefined,
}));
