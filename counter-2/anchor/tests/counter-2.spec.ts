import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Counter2 } from '../target/types/counter_2';

describe('counter-2', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Counter2 as Program<Counter2>;

  const counter2Keypair = Keypair.generate();

  it('Initialize Counter2', async () => {
    await program.methods
      .initialize()
      .accounts({
        counter2: counter2Keypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([counter2Keypair])
      .rpc();

    const currentCount = await program.account.counter2.fetch(
      counter2Keypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Counter2', async () => {
    await program.methods
      .increment()
      .accounts({ counter2: counter2Keypair.publicKey })
      .rpc();

    const currentCount = await program.account.counter2.fetch(
      counter2Keypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Counter2 Again', async () => {
    await program.methods
      .increment()
      .accounts({ counter2: counter2Keypair.publicKey })
      .rpc();

    const currentCount = await program.account.counter2.fetch(
      counter2Keypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Counter2', async () => {
    await program.methods
      .decrement()
      .accounts({ counter2: counter2Keypair.publicKey })
      .rpc();

    const currentCount = await program.account.counter2.fetch(
      counter2Keypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set counter2 value', async () => {
    await program.methods
      .set(42)
      .accounts({ counter2: counter2Keypair.publicKey })
      .rpc();

    const currentCount = await program.account.counter2.fetch(
      counter2Keypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the counter2 account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        counter2: counter2Keypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.counter2.fetchNullable(
      counter2Keypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
