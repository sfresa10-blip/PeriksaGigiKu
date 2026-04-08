import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { FileText, Download, Filter, Activity, ArrowLeft } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const aggregateData = [
    { name: 'Karies Gigi', count: 124 },
    { name: 'Gingivitis', count: 86 },
    { name: 'Kalkulus', count: 156 },
    { name: 'Persistensi', count: 24 },
    { name: 'Maloklusi', count: 42 },
  ];

  const trendData = [
    { month: 'Nov', dmft: 4.2, ohis: 2.1 },
    { month: 'Des', dmft: 3.8, ohis: 1.9 },
    { month: 'Jan', dmft: 3.5, ohis: 1.8 },
    { month: 'Feb', dmft: 3.4, ohis: 1.7 },
    { month: 'Mar', dmft: 3.2, ohis: 1.6 },
    { month: 'Apr', dmft: 3.1, ohis: 1.5 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-pink-100 text-pink-600 rounded-full transition-colors"
            title="Kembali"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Modul Pelaporan</h2>
            <p className="text-slate-500">Laporan agregat dan epidemiologi kesehatan gigi.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filter Periode
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={18} />
            Export PDF/Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FileText className="text-blue-500" size={20} />
            Prevalensi Penyakit Gigi (Agregat)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="text-emerald-500" size={20} />
            Tren Indeks Kesehatan (Rata-rata)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dmft" name="DMF-T" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="ohis" name="OHI-S" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold mb-6">Ringkasan Indikator Kinerja</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Total Kunjungan</p>
            <p className="text-2xl font-bold text-slate-800">432</p>
            <p className="text-xs text-emerald-500 mt-1">+12% dari bulan lalu</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Pasien Baru</p>
            <p className="text-2xl font-bold text-slate-800">58</p>
            <p className="text-xs text-emerald-500 mt-1">+5% dari bulan lalu</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">Tingkat Kepuasan</p>
            <p className="text-2xl font-bold text-slate-800">4.8/5.0</p>
            <p className="text-xs text-slate-400 mt-1">Berdasarkan 124 ulasan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
