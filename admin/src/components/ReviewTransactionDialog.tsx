import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Image from 'next/image'
import { post } from '@/lib/api'
import Toast from './Toast'

export interface ReviewTransaction {
  id: number;
  origin: string;
  destination: string;
  type: 'DEPOSITO' | 'RETIRO' | 'APUESTA';
  amount: number;
  date: string;
  proofOfPayment?: string;
}

interface Props {
  open: boolean
  transaction: ReviewTransaction | null
  onClose: () => void
  onReject: (id: number) => void
  onApprove: (id: number) => void
}

export default function ReviewTransactionDialog({
  open,
  transaction,
  onClose,
  onReject,
  onApprove,
}: Props) {
  const [toastMsg, setToastMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (status: 'ENTREGADA' | 'CANCELADA') => {
    if (!transaction) return
    setLoading(true)
    try {
      await post(`/api/admin/transactions/${transaction.id}/status`, { status })
      if (status === 'ENTREGADA') {
        onApprove(transaction.id)
        setToastMsg('Transacción aprobada')
      } else {
        onReject(transaction.id)
        setToastMsg('Transacción rechazada')
      }
      onClose()
    } catch (err) {
      console.error('status update failed', err)
      setToastMsg('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-[#1e1e1e] p-6 text-left align-middle shadow-xl transition-all text-white space-y-4">
                <Dialog.Title className="text-lg font-medium">Revisar Transacción</Dialog.Title>
                {transaction && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="font-semibold">De:</span>
                    <span>{transaction.origin}</span>
                    <span className="font-semibold">A:</span>
                    <span>{transaction.destination}</span>
                    <span className="font-semibold">Monto:</span>
                    <span>${"" + transaction.amount}</span>
                    <span className="font-semibold">Fecha:</span>
                    <span>{transaction.date}</span>
                    <span className="font-semibold">Tipo:</span>
                    <span>{transaction.type}</span>
                  </div>
                )}
                {transaction?.type === 'DEPOSITO' && transaction.proofOfPayment && (
                  <div className="mt-2">
                    <Image src={transaction.proofOfPayment} alt="Comprobante" width={300} height={200} className="rounded" />
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <button className="px-3 py-1 rounded bg-gray-700" onClick={onClose}>Cancelar</button>
                  {transaction && (
                    <>
                      <button
                        className="px-3 py-1 rounded bg-red-600 disabled:opacity-50"
                        onClick={() => handle('CANCELADA')}
                        disabled={loading}
                      >
                        Rechazar
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-green-600 disabled:opacity-50"
                        onClick={() => handle('ENTREGADA')}
                        disabled={loading}
                      >
                        Aprobar
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        </Dialog>
      </Transition.Root>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
    </>
  )
}
