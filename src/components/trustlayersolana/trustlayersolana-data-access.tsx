import { getTrustlayersolanaProgram, getTrustlayersolanaProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useTrustlayersolanaProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getTrustlayersolanaProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getTrustlayersolanaProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['trustlayersolana', 'all', { cluster }],
    queryFn: () => program.account.trustlayersolana.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['trustlayersolana', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ trustlayersolana: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useTrustlayersolanaProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useTrustlayersolanaProgram()

  const accountQuery = useQuery({
    queryKey: ['trustlayersolana', 'fetch', { cluster, account }],
    queryFn: () => program.account.trustlayersolana.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['trustlayersolana', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ trustlayersolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['trustlayersolana', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ trustlayersolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['trustlayersolana', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ trustlayersolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['trustlayersolana', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ trustlayersolana: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
