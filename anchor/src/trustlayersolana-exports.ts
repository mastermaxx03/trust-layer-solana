// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import TrustlayersolanaIDL from '../target/idl/trustlayersolana.json'
import type { Trustlayersolana } from '../target/types/trustlayersolana'

// Re-export the generated IDL and type
export { Trustlayersolana, TrustlayersolanaIDL }

// The programId is imported from the program IDL.
export const TRUSTLAYERSOLANA_PROGRAM_ID = new PublicKey(TrustlayersolanaIDL.address)

// This is a helper function to get the Trustlayersolana Anchor program.
export function getTrustlayersolanaProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...TrustlayersolanaIDL, address: address ? address.toBase58() : TrustlayersolanaIDL.address } as Trustlayersolana, provider)
}

// This is a helper function to get the program ID for the Trustlayersolana program depending on the cluster.
export function getTrustlayersolanaProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Trustlayersolana program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return TRUSTLAYERSOLANA_PROGRAM_ID
  }
}
