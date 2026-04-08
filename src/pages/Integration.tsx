import React, { useState } from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  Database,
  MessageSquare,
  CreditCard,
  HardDrive,
  Webhook,
  Globe,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

const Integration = () => {
  const [syncing, setSyncing] = useState<string | null>(null);

  const integrations = [
    {
      id: 'satusehat',
      name: 'SATUSEHAT (Kemenkes RI)',
      description: 'Integrasi rekam medis elektronik nasional sesuai standar HL7 FHIR.',
      status: 'Connected',
      lastSync: '2 menit yang lalu',
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'bpjs',
      name: 'P-Care BPJS Kesehatan',
      description: 'Sinkronisasi data kunjungan dan klaim pasien BPJS secara real-time.',
      status: 'Connected',
      lastSync: '1 jam yang lalu',
      icon: ShieldCheck,
      color: 'green'
    },
    {
      id: 'lab',
      name: 'Sistem Lab Eksternal',
      description: 'Terima hasil rujukan laboratorium gigi secara otomatis ke rekam medis.',
      status: 'Disconnected',
      lastSync: '-',
      icon: Database,
      color: 'slate'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Gateway',
      description: 'Kirim pengingat janji temu dan edukasi pasien secara otomatis via WhatsApp.',
      status: 'Connected',
      lastSync: '5 menit yang lalu',
      icon: MessageSquare,
      color: 'green'
    },
    {
      id: 'payment',
      name: 'Payment Gateway (Midtrans)',
      description: 'Terima pembayaran non-tunai (QRIS, VA, Kartu) terintegrasi dengan invoice.',
      status: 'Connected',
      lastSync: '10 menit yang lalu',
      icon: CreditCard,
      color: 'pink'
    },
    {
      id: 'storage',
      name: 'Cloud Storage (X-Ray)',
      description: 'Penyimpanan hasil rontgen dan foto klinis pasien di cloud yang aman.',
      status: 'Connected',
      lastSync: '30 menit yang lalu',
      icon: HardDrive,
      color: 'purple'
    }
  ];

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Integrasi Sistem</h1>
          <p className="text-slate-500 mt-2">Kelola koneksi dengan platform kesehatan eksternal dan API.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors">
            <Settings size={18} />
            API Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 shadow-lg shadow-pink-100 transition-all">
            <Cloud size={18} />
            Tambah Integrasi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.status === 'Connected' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
              }`}>
                {item.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">{item.description}</p>
            
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Last sync: <span className="text-slate-600 font-medium">{item.lastSync}</span>
              </div>
              <button 
                onClick={() => handleSync(item.id)}
                disabled={item.status !== 'Connected' || syncing === item.id}
                className="p-2 text-slate-400 hover:text-pink-500 disabled:opacity-30 transition-colors"
                title="Sync Now"
              >
                <RefreshCw size={18} className={syncing === item.id ? 'animate-spin text-pink-500' : ''} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-pink-300 text-xs font-bold mb-4">
              <Lock size={14} />
              SECURE API ACCESS
            </div>
            <h2 className="text-2xl font-bold mb-4">Dokumentasi API untuk Pengembang</h2>
            <p className="text-slate-400 leading-relaxed">
              Gunakan API kami untuk mengintegrasikan PeriksaGigiKu dengan sistem internal klinik Anda atau aplikasi pihak ketiga lainnya. Mendukung standar RESTful dan autentikasi OAuth2.
            </p>
            <div className="flex gap-4 mt-8">
              <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-bold transition-all">
                Buka Dokumentasi
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all flex items-center gap-2">
                Generate API Key
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-64 h-64 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-3xl absolute -right-20 -top-20" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl font-mono text-sm">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <p className="text-pink-400">GET <span className="text-white">/api/v1/patients</span></p>
              <p className="text-slate-500 mt-2">{"{"}</p>
              <p className="text-slate-300 ml-4">"status": <span className="text-green-400">"success"</span>,</p>
              <p className="text-slate-300 ml-4">"data": [...]</p>
              <p className="text-slate-500">{"}"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
            <Webhook className="text-pink-500" />
            Webhooks
          </h3>
          <p className="text-sm text-slate-500 mb-4">Kirim notifikasi real-time ke URL eksternal saat terjadi event tertentu.</p>
          <div className="space-y-3">
            {[
              { event: 'patient.created', url: 'https://hooks.clinic.com/new-patient' },
              { event: 'appointment.confirmed', url: 'https://hooks.clinic.com/reminders' },
            ].map((hook, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-pink-600 font-mono">{hook.event}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{hook.url}</p>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Edit</button>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold hover:border-pink-200 hover:text-pink-500 transition-all">
              + Tambah Webhook
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            Log Aktivitas Integrasi
          </h3>
          <div className="space-y-4">
            {[
              { time: '10:45', msg: 'Sinkronisasi SATUSEHAT berhasil', status: 'success' },
              { time: '09:12', msg: 'Data pasien BPJS diperbarui', status: 'success' },
              { time: 'Kemarin', msg: 'Gagal terhubung ke Lab Eksternal', status: 'error' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono">{log.time}</span>
                  <span className="text-slate-700 font-medium">{log.msg}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2">
            <AlertCircle className="text-amber-600" />
            Pemberitahuan Penting
          </h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            Sesuai dengan Peraturan Menteri Kesehatan No. 24 Tahun 2022, semua fasilitas pelayanan kesehatan wajib menyelenggarakan Rekam Medis Elektronik (RME) yang terintegrasi dengan platform SATUSEHAT paling lambat 31 Desember 2023.
          </p>
          <button className="mt-4 text-amber-900 font-bold text-sm hover:underline">
            Pelajari Selengkapnya &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Integration;
