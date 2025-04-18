import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Trustlayersolana } from '../target/types/trustlayersolana'

describe('trustlayersolana', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Trustlayersolana as Program<Trustlayersolana>

  const trustlayersolanaKeypair = Keypair.generate()

  it('Initialize Trustlayersolana', async () => {
    await program.methods
      .initialize()
      .accounts({
        trustlayersolana: trustlayersolanaKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([trustlayersolanaKeypair])
      .rpc()

    const currentCount = await program.account.trustlayersolana.fetch(trustlayersolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Trustlayersolana', async () => {
    await program.methods.increment().accounts({ trustlayersolana: trustlayersolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.trustlayersolana.fetch(trustlayersolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Trustlayersolana Again', async () => {
    await program.methods.increment().accounts({ trustlayersolana: trustlayersolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.trustlayersolana.fetch(trustlayersolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Trustlayersolana', async () => {
    await program.methods.decrement().accounts({ trustlayersolana: trustlayersolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.trustlayersolana.fetch(trustlayersolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set trustlayersolana value', async () => {
    await program.methods.set(42).accounts({ trustlayersolana: trustlayersolanaKeypair.publicKey }).rpc()

    const currentCount = await program.account.trustlayersolana.fetch(trustlayersolanaKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the trustlayersolana account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        trustlayersolana: trustlayersolanaKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.trustlayersolana.fetchNullable(trustlayersolanaKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
