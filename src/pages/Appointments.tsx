import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  User,
  Phone,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

const Appointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const appointments = [
    { id: 1, patientName: 'Budi Santoso', rm: 'RM-2024-001', day: 'Senin', date: '5 April 2026', time: '09:00', phone: '0812-3456-7890', status: 'Selesai', type: 'Scaling' },
    { id: 2, patientName: 'Siti Aminah', rm: 'RM-2024-015', day: 'Senin', date: '5 April 2026', time: '10:30', phone: '0856-7890-1234', status: 'Menunggu', type: 'Konsultasi' },
    { id: 3, patientName: 'Andi Wijaya', rm: 'RM-2024-042', day: 'Senin', date: '5 April 2026', time: '11:15', phone: '0813-2109-8765', status: 'Menunggu', type: 'Follow-up' },
    { id: 4, patientName: 'Dewi Lestari', rm: 'RM-2024-089', day: 'Senin', date: '5 April 2026', time: '13:00', phone: '0877-5544-3322', status: 'Terjadwal', type: 'Edukasi OH' },
    { id: 5, patientName: 'Eko Prasetyo', rm: 'RM-2024-102', day: 'Selasa', date: '6 April 2026', time: '09:30', phone: '0819-0011-2233', status: 'Terjadwal', type: 'Penambalan' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Menunggu': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Terjadwal': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Dibatalkan': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-pink-100 text-pink-600 rounded-full transition-colors"
            title="Kembali"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Jadwal & Janji</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500 text-sm flex items-center gap-1">
                <CalendarIcon size={14} className="text-pink-400" />
                {formatDay(currentTime)}, {formatDate(currentTime)}
              </p>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <p className="text-slate-500 text-sm flex items-center gap-1">
                <Clock size={14} className="text-pink-400" />
                {formatTime(currentTime)} WIB
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <CalendarIcon size={18} />
            Kalender
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-sm flex items-center justify-center gap-2">
            <Plus size={18} />
            Janji Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">April 2026</h3>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronLeft size={16} /></button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map(d => (
                <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: 30 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === 2;
                return (
                  <button 
                    key={i} 
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-lg text-sm transition-colors",
                      isToday ? "bg-pink-500 text-white font-bold" : "hover:bg-pink-50 text-slate-600"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Statistik Janji</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total Hari Ini</span>
                <span className="text-sm font-bold text-slate-800">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Selesai</span>
                <span className="text-sm font-bold text-emerald-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Menunggu</span>
                <span className="text-sm font-bold text-amber-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Terjadwal</span>
                <span className="text-sm font-bold text-pink-600">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari pasien atau nomor RM..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 focus:border-pink-500 focus:ring-pink-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm">
                <Filter size={16} />
                Filter
              </button>
              <select className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm focus:ring-pink-500 focus:border-pink-500">
                <option>Semua Status</option>
                <option>Selesai</option>
                <option>Menunggu</option>
                <option>Terjadwal</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {appointments.length > 0 ? appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-pink-200 transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800">{apt.patientName}</h4>
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{apt.rm}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} className="text-pink-400" />
                          <span>{apt.day}, {apt.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-pink-400" />
                          <span>{apt.time} WIB</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={14} className="text-pink-400" />
                          <span>{apt.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-3">
                    <div className="flex flex-col items-end gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border",
                        getStatusColor(apt.status)
                      )}>
                        {apt.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{apt.type}</span>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-1">
                    <FileText size={14} />
                    Detail
                  </button>
                  {apt.status === 'Menunggu' && (
                    <button className="px-3 py-1.5 text-xs font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-lg">
                      Panggil Pasien
                    </button>
                  )}
                  {apt.status === 'Terjadwal' && (
                    <button className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg">
                      Konfirmasi
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                <CalendarIcon className="mx-auto mb-4 opacity-20" size={48} />
                <p>Belum ada jadwal janji temu untuk hari ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
