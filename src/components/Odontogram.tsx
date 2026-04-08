import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface ToothProps {
  number: number;
  status: string;
  onClick: (number: number) => void;
  position: 'top' | 'bottom';
}

const Tooth = ({ number, status, onClick, position }: ToothProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Karies': return 'fill-rose-500';
      case 'Tambalan': return 'fill-primary-pink';
      case 'Missing': return 'fill-slate-300';
      case 'Impaksi': return 'fill-amber-500';
      default: return 'fill-white';
    }
  };

  return (
    <div 
      className="flex flex-col items-center cursor-pointer group"
      onClick={() => onClick(number)}
    >
      {position === 'bottom' && <span className="text-[10px] font-black text-slate-400 mb-1">{number}</span>}
      <svg width="24" height="32" viewBox="0 0 24 32" className="drop-shadow-sm transition-transform group-hover:scale-110">
        <path 
          d="M4 8C4 4 8 2 12 2C16 2 20 4 20 8C20 12 18 16 16 24C15 28 14 30 12 30C10 30 9 28 8 24C6 16 4 12 4 8Z" 
          className={cn("stroke-slate-300 stroke-1 transition-colors group-hover:stroke-primary-pink", getStatusColor())}
        />
        {status === 'Karies' && <circle cx="12" cy="10" r="3" className="fill-white/50" />}
      </svg>
      {position === 'top' && <span className="text-[10px] font-black text-slate-400 mt-1">{number}</span>}
    </div>
  );
};

interface OdontogramProps {
  data?: Record<number, string>;
  onChange?: (data: Record<number, string>) => void;
}

const Odontogram = ({ data = {}, onChange }: OdontogramProps) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [toothType, setToothType] = useState<'permanent' | 'deciduous'>('permanent');

  const teethTopPermanent = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const teethBottomPermanent = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const teethTopDeciduous = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
  const teethBottomDeciduous = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

  const teethTop = toothType === 'permanent' ? teethTopPermanent : teethTopDeciduous;
  const teethBottom = toothType === 'permanent' ? teethBottomPermanent : teethBottomDeciduous;

  const handleToothClick = (num: number) => {
    setSelectedTooth(num);
  };

  const setStatus = (status: string) => {
    if (selectedTooth && onChange) {
      const newData = { ...data, [selectedTooth]: status };
      onChange(newData);
      setSelectedTooth(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h4 className="text-xl font-black text-slate-800 tracking-tight">Odontogram <span className="text-primary-pink">Interaktif</span></h4>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => setToothType('permanent')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                toothType === 'permanent' 
                  ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20" 
                  : "bg-slate-100 text-slate-400 hover:bg-soft-blue hover:text-primary-blue"
              )}
            >
              Gigi Permanen
            </button>
            <button 
              onClick={() => setToothType('deciduous')}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                toothType === 'deciduous' 
                  ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20" 
                  : "bg-slate-100 text-slate-400 hover:bg-soft-blue hover:text-primary-blue"
              )}
            >
              Gigi Susu
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="w-4 h-4 bg-white border border-slate-200 rounded-md"></div> Normal
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="w-4 h-4 bg-rose-500 rounded-md shadow-sm shadow-rose-200"></div> Karies
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="w-4 h-4 bg-primary-pink rounded-md shadow-sm shadow-primary-pink/20"></div> Tambalan
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <div className="w-4 h-4 bg-slate-300 rounded-md shadow-sm shadow-slate-100"></div> Missing
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 items-center overflow-x-auto pb-6 custom-scrollbar">
        <div className="flex gap-1">
          {teethTop.map(num => (
            <Tooth 
              key={num} 
              number={num} 
              status={data[num] || 'Normal'} 
              onClick={handleToothClick}
              position="top"
            />
          ))}
        </div>
        <div className="w-full h-px bg-slate-100"></div>
        <div className="flex gap-1">
          {teethBottom.map(num => (
            <Tooth 
              key={num} 
              number={num} 
              status={data[num] || 'Normal'} 
              onClick={handleToothClick}
              position="bottom"
            />
          ))}
        </div>
      </div>

      {selectedTooth && (
        <div className="mt-8 p-6 bg-soft-blue/30 rounded-3xl border border-soft-blue-dark animate-in zoom-in-95 duration-300">
          <p className="text-xs font-black uppercase tracking-widest mb-4 text-primary-blue">Set Status Gigi <span className="text-primary-pink">{selectedTooth}</span>:</p>
          <div className="flex flex-wrap gap-3">
            {['Normal', 'Karies', 'Tambalan', 'Missing', 'Impaksi', 'Sisa Akar'].map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="px-5 py-2.5 bg-white border border-soft-blue-dark rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:border-primary-pink hover:text-primary-pink hover:shadow-lg hover:shadow-primary-pink/10 transition-all"
              >
                {s}
              </button>
            ))}
            <button 
              onClick={() => setSelectedTooth(null)}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Odontogram;
