import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CalendarCheck, 
  Activity, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();
  const [patientCount, setPatientCount] = useState(0);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'patients'), (snapshot) => {
      setPatientCount(snapshot.size);
      const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentPatients(patients.slice(0, 4));
    });
    return () => unsubscribe();
  }, []);

  const stats = [
    { label: 'Total Pasien', value: patientCount.toString(), icon: Users, color: 'bg-primary-pink', trend: '+12%', trendUp: true },
    { label: 'Kunjungan Hari Ini', value: '8', icon: CalendarCheck, color: 'bg-primary-blue', trend: '+5%', trendUp: true },
    { label: 'Rata-rata DMF-T', value: '3.2', icon: Activity, color: 'bg-amber-400', trend: '-2%', trendUp: false },
    { label: 'Follow-up Dibutuhkan', value: '14', icon: AlertCircle, color: 'bg-rose-400', trend: '+3', trendUp: true },
  ];

  const dmftData = [
    { month: 'Nov', value: 4.2 },
    { month: 'Des', value: 3.8 },
    { month: 'Jan', value: 3.5 },
    { month: 'Feb', value: 3.4 },
    { month: 'Mar', value: 3.2 },
    { month: 'Apr', value: 3.1 },
  ];

  const diagnosisData = [
    { name: 'Karies', value: 45 },
    { name: 'Gingivitis', value: 30 },
    { name: 'Kalkulus', value: 15 },
    { name: 'Lainnya', value: 10 },
  ];

  const COLORS = ['#f472b6', '#60a5fa', '#fbbf24', '#fb7185'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center bg-white hover:bg-soft-blue text-primary-blue rounded-2xl transition-all shadow-sm border border-soft-blue-dark group"
            title="Kembali"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard <span className="text-primary-pink">Utama</span></h2>
            <p className="text-slate-500 font-medium">Selamat datang kembali! Berikut ringkasan kesehatan gigi hari ini.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-soft-blue-dark">
          <div className="w-10 h-10 rounded-xl bg-soft-blue flex items-center justify-center text-primary-blue">
            <CalendarCheck size={20} />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari Ini</p>
            <p className="text-sm font-black text-slate-700">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white hover:scale-[1.02] transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6", stat.color)}>
                <stat.icon size={28} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter",
                stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Tren Indeks <span className="text-primary-pink">DMF-T</span></h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">6 Bulan Terakhir</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dmftData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f472b6" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#f472b6', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Diagnosis <span className="text-primary-blue">Utama</span></h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diagnosisData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {diagnosisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6 w-full">
              {diagnosisData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-[11px] font-bold text-slate-500 truncate">{item.name}</span>
                  <span className="text-[11px] font-black text-slate-800 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Kunjungan <span className="text-primary-pink">Hari Ini</span></h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={() => navigate('/appointments')}
            className="px-6 py-2.5 bg-soft-blue text-primary-blue rounded-xl text-sm font-black hover:bg-primary-blue hover:text-white transition-all shadow-sm"
          >
            Lihat Semua Jadwal
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Pasien</th>
                <th className="px-8 py-5">No. RM</th>
                <th className="px-8 py-5">Waktu</th>
                <th className="px-8 py-5">Tujuan</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {recentPatients.length > 0 ? recentPatients.map((patient, i) => (
                <tr key={i} className="hover:bg-soft-blue/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-baby-pink flex items-center justify-center text-primary-pink font-black text-xs">
                        {patient.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-primary-blue transition-colors">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium">{patient.rm}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <CalendarCheck size={14} className="text-primary-blue" />
                      {['09:00', '10:30', '11:15', '13:00'][i % 4]}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                      {['Scaling', 'Konsultasi', 'Follow-up', 'Edukasi OH'][i % 4]}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      i % 3 === 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      i % 3 === 1 ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-primary-pink/10 text-primary-pink border-primary-pink/20"
                    )}>
                      {i % 3 === 0 ? 'Selesai' : i % 3 === 1 ? 'Menunggu' : 'Terjadwal'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Belum ada aktivitas kunjungan hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
