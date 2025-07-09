import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

export interface ReviewTransaction {
  id: string;
  origin: string;
  destination: string;
  type: 'DEPOSITO' | 'RETIRO' | 'APUESTA';
  amount: number;
  date: string;
  proofOfPayment?: string;
}

interface Props {
  open: boolean;
  transaction: ReviewTransaction | null;
  onClose: () => void;
  onReject: (id: string) => void;
  onApprove: (id: string) => void;
}

export default function ReviewTransactionDialog({ open, transaction, onClose, onReject, onApprove }: Props) {
  return (
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
                      <button className="px-3 py-1 rounded bg-red-600" onClick={() => onReject(transaction.id)}>Rechazar</button>
                      <button className="px-3 py-1 rounded bg-green-600" onClick={() => onApprove(transaction.id)}>Aprobar</button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
