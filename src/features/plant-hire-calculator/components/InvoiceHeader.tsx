import React from 'react';
import { FileText } from 'lucide-react';

export interface InvoiceMeta {
  clientName: string;
  invoiceNumber: string;
  poReference: string;
}

interface InvoiceHeaderProps {
  meta: InvoiceMeta;
  onChange: (meta: InvoiceMeta) => void;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ meta, onChange }) => {
  const update = (field: keyof InvoiceMeta, value: string) => {
    onChange({ ...meta, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-3.5 h-3.5 text-emerald-600" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Details</span>
        <span className="text-[10px] text-slate-400">(optional)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Client / Municipality
          </label>
          <input
            type="text"
            placeholder="e.g. City of Tshwane"
            value={meta.clientName}
            onChange={(e) => update('clientName', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            placeholder="e.g. INV-2025-047"
            value={meta.invoiceNumber}
            onChange={(e) => update('invoiceNumber', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
            PO / Reference
          </label>
          <input
            type="text"
            placeholder="e.g. PO-0042-TW"
            value={meta.poReference}
            onChange={(e) => update('poReference', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
