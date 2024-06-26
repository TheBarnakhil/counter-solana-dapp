'use client';

import { Counter2IDL, getCounter2ProgramId } from '@counter-2/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useCounter2Program() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getCounter2ProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(Counter2IDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['counter-2', 'all', { cluster }],
    queryFn: () => program.account.counter2.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['counter-2', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ counter2: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useCounter2ProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useCounter2Program();

  const accountQuery = useQuery({
    queryKey: ['counter-2', 'fetch', { cluster, account }],
    queryFn: () => program.account.counter2.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['counter-2', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ counter2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['counter-2', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ counter2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['counter-2', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ counter2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['counter-2', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ counter2: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
