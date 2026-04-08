import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Send, 
  Search, 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  Printer,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ReferralRecord {
  patientId: string;
  patientName: string;
  referral: {
    isNeeded: boolean;
    destination: string;
    reason: string;
    clinicalFindings: string;
    treatmentPerformed: string;
    date: string;
    doctorName: string;
  };
}

const Referrals = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const q = query(collection(db, 'medical_records'));
        const querySnapshot = await getDocs(q);
        const referralList: ReferralRecord[] = [];
        
        // We need patient names too, so we'll fetch them or assume they are in the record
        // For simplicity in this demo, we'll fetch all and filter
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          if (data.referral?.isNeeded) {
            // Fetch patient name
            referralList.push({
              patientId: doc.id,
              patientName: data.patientName || 'Pasien Tanpa Nama',
              referral: data.referral
            });
          }
        }
        setReferrals(referralList);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const filteredReferrals = referrals.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.referral.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Kembali</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Rujukan</h2>
            <p className="text-slate-500 text-sm font-medium">Daftar pasien yang memerlukan rujukan ke fasilitas kesehatan lain.</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama pasien atau tujuan rujukan..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-pink outline-none shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-primary-pink border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat data rujukan...</p>
        </div>
      ) : filteredReferrals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReferrals.map((r) => (
            <div 
              key={r.patientId} 
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-primary-pink/10 transition-all group"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-soft-blue rounded-2xl flex items-center justify-center text-primary-blue shadow-sm">
                    <User size={24} />
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    Aktif
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-slate-800 mb-1 group-hover:text-primary-pink transition-colors">
                  {r.patientName}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">ID: {r.patientId.slice(0, 8)}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-primary-pink mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tujuan Rujukan</p>
                      <p className="text-sm font-bold text-slate-700">{r.referral.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-primary-pink mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Rujukan</p>
                      <p className="text-sm font-bold text-slate-700">{r.referral.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText size={16} className="text-primary-pink mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alasan</p>
                      <p className="text-sm font-bold text-slate-700 line-clamp-2">{r.referral.reason}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/medical-records/${r.patientId}`)}
                    className="flex-1 py-3 bg-soft-blue text-primary-blue rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-blue hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Detail <ChevronRight size={14} />
                  </button>
                  <button 
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary-pink hover:text-white transition-all shadow-sm"
                    title="Cetak Surat Rujukan"
                  >
                    <Printer size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Send size={40} />
          </div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Tidak Ada Rujukan</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Belum ada pasien yang memerlukan rujukan saat ini.</p>
        </div>
      )}
    </div>
  );
};

export default Referrals;
