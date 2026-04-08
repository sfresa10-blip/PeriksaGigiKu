import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Eye, 
  History, 
  UserCheck, 
  FileLock,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { motion } from 'motion/react';

const Security = () => {
  const securityStats = [
    { label: 'Enkripsi Data', value: 'AES-256', icon: Lock, color: 'green' },
    { label: 'Audit Log', value: 'Aktif', icon: History, color: 'blue' },
    { label: 'Backup Otomatis', value: 'Harian', icon: ShieldCheck, color: 'pink' },
  ];

  const auditLogs = [
    { user: 'drg. Sarah', action: 'Mengakses Rekam Medis #102', time: '5 menit yang lalu', ip: '192.168.1.45' },
    { user: 'Admin Staff', action: 'Login ke Sistem', time: '1 jam yang lalu', ip: '192.168.1.12' },
    { user: 'drg. Budi', action: 'Mengubah Jadwal Janji', time: '2 jam yang lalu', ip: '192.168.1.33' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Keamanan Data</h1>
        <p className="text-slate-500 mt-2">Pantau dan kelola keamanan data pasien sesuai standar privasi medis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {securityStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <History className="text-slate-400" size={20} />
              Audit Log Terbaru
            </h3>
            <button className="text-pink-500 text-sm font-bold hover:underline">Lihat Semua</button>
          </div>
          <div className="divide-y divide-slate-50">
            {auditLogs.map((log, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                    {log.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{log.user}</p>
                    <p className="text-xs text-slate-500">{log.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400">{log.time}</p>
                  <p className="text-[10px] text-slate-300 font-mono">{log.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Key className="text-pink-400" />
              Autentikasi Dua Faktor (2FA)
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Tingkatkan keamanan akun Anda dengan mewajibkan kode verifikasi setiap kali Anda login. Sangat disarankan untuk semua staf medis.
            </p>
            <button className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-bold transition-all">
              Aktifkan 2FA Sekarang
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-green-500" />
              Kepatuhan Regulasi
            </h3>
            <div className="space-y-4">
              {[
                { label: 'HIPAA Compliance', status: 'Verified' },
                { label: 'GDPR / UU PDP', status: 'Verified' },
                { label: 'ISO 27001', status: 'In Progress' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    item.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-600 h-fit">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-red-900 mb-1">Peringatan Keamanan</h3>
            <p className="text-sm text-red-700 leading-relaxed">
              Terdeteksi 3 percobaan login gagal dari IP yang tidak dikenal (Jakarta, ID) pada pukul 03:15 pagi ini. Sistem telah memblokir sementara akses dari IP tersebut.
            </p>
            <button className="mt-4 text-red-900 font-bold text-sm hover:underline">
              Tinjau Percobaan Login &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
