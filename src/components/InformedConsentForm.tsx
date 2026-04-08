import React, { useState } from 'react';
import { ShieldCheck, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SignaturePad from './SignaturePad';
import { cn } from '../lib/utils';

interface InformedConsentProps {
  data?: {
    isAgreed: boolean;
    patientSig: string | null;
    doctorSig: string | null;
  };
  onChange?: (data: any) => void;
}

const InformedConsentForm = ({ data, onChange }: InformedConsentProps) => {
  const isAgreed = data?.isAgreed || false;
  const patientSig = data?.patientSig || null;
  const doctorSig = data?.doctorSig || null;

  const updateData = (updates: any) => {
    if (onChange) {
      onChange({
        isAgreed,
        patientSig,
        doctorSig,
        ...updates
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-baby-pink border border-baby-pink-dark p-8 rounded-[2.5rem] flex gap-6 shadow-xl shadow-primary-pink/5">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-pink shadow-sm shrink-0">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Persetujuan Tindakan Medis <span className="text-primary-pink">(Informed Consent)</span></h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">
            Sesuai dengan Peraturan Menteri Kesehatan No. 290/MENKES/PER/III/2008, setiap tindakan kedokteran yang mengandung risiko tinggi harus diberikan dengan persetujuan tertulis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <section className="space-y-5">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-8 bg-soft-blue rounded-lg flex items-center justify-center text-primary-blue">
                <Info size={18} />
              </div>
              Informasi Tindakan
            </h4>
            <div className="bg-white border border-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 space-y-6">
              <div className="group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary-pink transition-colors">Diagnosis</p>
                <p className="text-sm font-black text-slate-700">Karies Dentin (Gigi 36), Gingivitis Marginal Terlokalisir</p>
              </div>
              <div className="group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary-pink transition-colors">Rencana Tindakan</p>
                <p className="text-sm font-black text-slate-700">Scaling & Root Planing, Penambalan Resin Komposit</p>
              </div>
              <div className="group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary-pink transition-colors">Tujuan & Manfaat</p>
                <p className="text-sm font-black text-slate-700">Menghilangkan infeksi, mengembalikan fungsi kunyah, dan mencegah kerusakan lebih lanjut.</p>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                <AlertTriangle size={18} />
              </div>
              Risiko & Komplikasi
            </h4>
            <div className="bg-white border border-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50">
              <ul className="space-y-3">
                {['Rasa tidak nyaman/ngilu pasca tindakan', 'Perdarahan ringan pada gusi', 'Reaksi alergi terhadap bahan tambalan (jarang)', 'Kegagalan restorasi jika instruksi pasca tindakan tidak diikuti'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-500">
                    <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 space-y-8">
            <label className="flex gap-4 cursor-pointer group p-4 rounded-2xl hover:bg-soft-blue/30 transition-all">
              <input 
                type="checkbox" 
                className="w-6 h-6 mt-0.5 rounded-lg text-primary-pink focus:ring-primary-pink border-soft-blue-dark transition-all cursor-pointer"
                checked={isAgreed}
                onChange={(e) => updateData({ isAgreed: e.target.checked })}
              />
              <span className="text-sm font-black text-slate-600 leading-relaxed uppercase tracking-tight">
                Saya telah menerima informasi lengkap mengenai diagnosis, rencana tindakan, risiko, dan alternatif perawatan. Saya memberikan persetujuan secara sadar untuk dilakukan tindakan medis tersebut.
              </span>
            </label>

            {isAgreed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                <div className="space-y-4">
                  {patientSig ? (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tanda Tangan Pasien</p>
                      <div className="bg-soft-blue/30 border border-soft-blue-dark rounded-[2rem] p-6 flex flex-col items-center shadow-inner">
                        <img src={patientSig} alt="Patient Signature" className="h-24 object-contain" />
                        <button 
                          onClick={() => updateData({ patientSig: null })}
                          className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline mt-4"
                        >
                          Ulangi Tanda Tangan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <SignaturePad label="Tanda Tangan Pasien" onSave={(sig) => updateData({ patientSig: sig })} />
                  )}
                </div>

                <div className="space-y-4">
                  {doctorSig ? (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tanda Tangan Dokter</p>
                      <div className="bg-soft-blue/30 border border-soft-blue-dark rounded-[2rem] p-6 flex flex-col items-center shadow-inner">
                        <img src={doctorSig} alt="Doctor Signature" className="h-24 object-contain" />
                        <button 
                          onClick={() => updateData({ doctorSig: null })}
                          className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline mt-4"
                        >
                          Ulangi Tanda Tangan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <SignaturePad label="Tanda Tangan Dokter" onSave={(sig) => updateData({ doctorSig: sig })} />
                  )}
                </div>
              </div>
            )}

            {patientSig && doctorSig && (
              <div className="bg-emerald-50 text-emerald-600 p-6 rounded-[2rem] flex items-center gap-4 animate-in zoom-in-95 duration-500 border border-emerald-100 shadow-lg shadow-emerald-100/50">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-sm font-black uppercase tracking-widest">Dokumen Informed Consent Lengkap & Sah</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformedConsentForm;
