import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Trash2, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signature: string) => void;
  label: string;
}

const SignaturePad = ({ onSave, label }: SignaturePadProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) return;
    const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
        >
          <Trash2 size={14} />
          Hapus
        </button>
        <button
          type="button"
          onClick={save}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors ml-auto"
        >
          <Check size={14} />
          Konfirmasi Tanda Tangan
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
