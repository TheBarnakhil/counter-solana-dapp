// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Counter2 } from '../target/types/counter_2';
import { IDL as Counter2IDL } from '../target/types/counter_2';

// Re-export the generated IDL and type
export { Counter2, Counter2IDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const COUNTER_2_PROGRAM_ID = new PublicKey(
  'AZEnaNRnFrgtzorayRzCtWFEdRXwYdsnvAPKUS1oy9o2'
);

// This is a helper function to get the program ID for the Counter2 program depending on the cluster.
export function getCounter2ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return COUNTER_2_PROGRAM_ID;
  }
}
