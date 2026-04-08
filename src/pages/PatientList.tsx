import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Filter, Edit, Trash2, Eye, X, Save, ArrowLeft, ClipboardList, RefreshCw, Users, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const PatientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{id: string, name: string} | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  useEffect(() => {
    const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'patients');
    });

    return () => unsubscribe();
  }, []);

  const [newPatient, setNewPatient] = useState({
    name: '',
    nik: '',
    gender: 'L',
    age: '',
    birthDate: '',
    birthPlace: '',
    religion: '',
    occupation: '',
    nationality: 'Indonesia',
    address: '',
    bloodType: '',
    maritalStatus: '',
    dependents: { children: '', others: '' },
    ethnicity: '',
    weight: '',
    height: '',
    dentistName: '',
    dentistPhone: '',
    dentistAddress: '',
    doctorName: '',
    doctorPhone: '',
    doctorAddress: '',
    phone: '',
    insurance: 'Umum',
    referralSource: ''
  });

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || modalMode === 'view') return;
    
    setIsSubmitting(true);
    try {
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (authError) {
          console.warn('Anonymous sign-in failed, proceeding with unauthenticated save (relaxed rules):', authError);
        }
      }

      const patientData = {
        ...newPatient,
        age: parseInt(newPatient.age) || 0,
        weight: parseFloat(newPatient.weight) || 0,
        height: parseFloat(newPatient.height) || 0,
        updatedAt: Timestamp.now()
      };

      if (modalMode === 'edit' && selectedPatientId) {
        await setDoc(doc(db, 'patients', selectedPatientId), patientData, { merge: true });
        setNotification({ message: 'Data pasien berhasil diperbarui!', type: 'success' });
      } else {
        const rmNumber = patients.length + 1;
        const rm = `RM-2024-${rmNumber.toString().padStart(3, '0')}`;
        
        const docRef = await addDoc(collection(db, 'patients'), {
          ...patientData,
          rm,
          createdAt: Timestamp.now()
        });
        setNotification({ message: 'Pasien baru berhasil didaftarkan!', type: 'success' });
        setTimeout(() => navigate(`/medical-records/${docRef.id}`), 1500);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Save patient error:', error);
      if (error.message?.includes('insufficient permissions')) {
        setNotification({ message: 'Gagal menyimpan: Izin ditolak. Pastikan Anda sudah login.', type: 'error' });
      } else {
        setNotification({ message: `Terjadi kesalahan: ${error.message || String(error)}`, type: 'error' });
      }
      handleFirestoreError(error, modalMode === 'edit' ? OperationType.UPDATE : OperationType.CREATE, 'patients');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const resetForm = () => {
    setNewPatient({ 
      name: '', nik: '', gender: 'L', age: '', birthDate: '', birthPlace: '', religion: '', 
      occupation: '', nationality: 'Indonesia', address: '', bloodType: '', maritalStatus: '', 
      dependents: { children: '', others: '' }, ethnicity: '', weight: '', height: '', 
      dentistName: '', dentistPhone: '', dentistAddress: '', doctorName: '', doctorPhone: '', 
      doctorAddress: '', phone: '', insurance: 'Umum', referralSource: '' 
    });
    setSelectedPatientId(null);
    setModalMode('add');
  };

  const handleEditPatient = (patient: any) => {
    setNewPatient({
      name: patient.name || '',
      nik: patient.nik || '',
      gender: patient.gender || 'L',
      age: patient.age?.toString() || '',
      birthDate: patient.birthDate || '',
      birthPlace: patient.birthPlace || '',
      religion: patient.religion || '',
      occupation: patient.occupation || '',
      nationality: patient.nationality || 'Indonesia',
      address: patient.address || '',
      bloodType: patient.bloodType || '',
      maritalStatus: patient.maritalStatus || '',
      dependents: patient.dependents || { children: '', others: '' },
      ethnicity: patient.ethnicity || '',
      weight: patient.weight?.toString() || '',
      height: patient.height?.toString() || '',
      dentistName: patient.dentistName || '',
      dentistPhone: patient.dentistPhone || '',
      dentistAddress: patient.dentistAddress || '',
      doctorName: patient.doctorName || '',
      doctorPhone: patient.doctorPhone || '',
      doctorAddress: patient.doctorAddress || '',
      phone: patient.phone || '',
      insurance: patient.insurance || 'Umum',
      referralSource: patient.referralSource || ''
    });
    setSelectedPatientId(patient.id);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewPatient = (patient: any) => {
    handleEditPatient(patient);
    setModalMode('view');
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'patients', patientToDelete.id));
      setNotification({ message: `Data pasien ${patientToDelete.name} berhasil dihapus.`, type: 'success' });
    } catch (error) {
      setNotification({ message: 'Gagal menghapus data pasien.', type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `patients/${patientToDelete.id}`);
    } finally {
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const confirmDelete = (patient: any) => {
    setPatientToDelete({ id: patient.id, name: patient.name });
    setIsDeleteModalOpen(true);
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nik.includes(searchTerm) ||
    p.rm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Notification Toast */}
      {notification && (
        <div className={cn(
          "fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-4 duration-300 flex items-center gap-3 border",
          notification.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
        )}>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white",
            notification.type === 'success' ? "bg-emerald-500" : "bg-rose-500"
          )}>
            {notification.type === 'success' ? <ShieldCheck size={18} /> : <X size={18} />}
          </div>
          <span className="font-bold text-sm">{notification.message}</span>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Trash2 size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Data Pasien?</h3>
              <p className="text-slate-500 font-medium mb-8">
                Apakah Anda yakin ingin menghapus data <span className="text-slate-800 font-black">{patientToDelete?.name}</span>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeletePatient}
                  className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-2xl font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center bg-white hover:bg-soft-blue text-primary-blue rounded-2xl transition-all shadow-sm border border-soft-blue-dark group"
            title="Kembali"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Data Master <span className="text-primary-pink">Pasien</span></h2>
            <p className="text-slate-500 font-medium">Kelola informasi identitas dan data sosial pasien.</p>
          </div>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary-pink text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-primary-pink/30 font-black text-sm"
        >
          <UserPlus size={20} />
          <span>Tambah Pasien Baru</span>
        </button>
      </div>

      {/* Modal Tambah Pasien */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-baby-pink-dark">
            <div className="p-8 border-b border-baby-pink flex justify-between items-center bg-baby-pink/50">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-primary-pink rounded-xl text-white shadow-md">
                  {modalMode === 'add' ? <UserPlus size={24} /> : modalMode === 'edit' ? <Edit size={24} /> : <Eye size={24} />}
                </div>
                {modalMode === 'add' ? 'Registrasi Pasien Baru' : modalMode === 'edit' ? 'Edit Data Pasien' : 'Detail Data Pasien'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/50 text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIK</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.nik}
                    onChange={(e) => setNewPatient({ ...newPatient, nik: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jenis Kelamin</label>
                  <select 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Umur (Tahun)</label>
                  <input 
                    type="number" 
                    required
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Lahir</label>
                  <input 
                    type="date" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.birthDate}
                    onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tempat Lahir</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.birthPlace}
                    onChange={(e) => setNewPatient({ ...newPatient, birthPlace: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agama</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.religion}
                    onChange={(e) => setNewPatient({ ...newPatient, religion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pekerjaan</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.occupation}
                    onChange={(e) => setNewPatient({ ...newPatient, occupation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bangsa</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.nationality}
                    onChange={(e) => setNewPatient({ ...newPatient, nationality: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Golongan Darah</label>
                  <select 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.bloodType}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodType: e.target.value })}
                  >
                    <option value="">Pilih</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Perkawinan</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.maritalStatus}
                    onChange={(e) => setNewPatient({ ...newPatient, maritalStatus: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Suku/Adat</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.ethnicity}
                    onChange={(e) => setNewPatient({ ...newPatient, ethnicity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Berat Badan (Kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.weight}
                    onChange={(e) => setNewPatient({ ...newPatient, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tinggi Badan (cm)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.height}
                    onChange={(e) => setNewPatient({ ...newPatient, height: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                  <textarea 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 min-h-[100px] disabled:opacity-60"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. Telepon</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asuransi Kesehatan</label>
                  <select 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.insurance}
                    onChange={(e) => setNewPatient({ ...newPatient, insurance: e.target.value })}
                  >
                    <option value="Umum">Umum (Mandiri)</option>
                    <option value="BPJS">BPJS Kesehatan</option>
                    <option value="Asuransi Swasta">Asuransi Swasta</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sumber Rujukan</label>
                  <input 
                    type="text" 
                    disabled={modalMode === 'view'}
                    className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                    value={newPatient.referralSource}
                    onChange={(e) => setNewPatient({ ...newPatient, referralSource: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-baby-pink">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Informasi Dokter/Drg Langganan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Drg.</label>
                    <input 
                      type="text" 
                      disabled={modalMode === 'view'}
                      className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                      value={newPatient.dentistName}
                      onChange={(e) => setNewPatient({ ...newPatient, dentistName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. Tlp. Drg.</label>
                    <input 
                      type="text" 
                      disabled={modalMode === 'view'}
                      className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                      value={newPatient.dentistPhone}
                      onChange={(e) => setNewPatient({ ...newPatient, dentistPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Dokter</label>
                    <input 
                      type="text" 
                      disabled={modalMode === 'view'}
                      className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                      value={newPatient.doctorName}
                      onChange={(e) => setNewPatient({ ...newPatient, doctorName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">No. Tlp. Dokter</label>
                    <input 
                      type="text" 
                      disabled={modalMode === 'view'}
                      className="w-full rounded-2xl border-soft-blue-dark bg-soft-blue/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700 disabled:opacity-60"
                      value={newPatient.doctorPhone}
                      onChange={(e) => setNewPatient({ ...newPatient, doctorPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  {modalMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {modalMode !== 'view' && (
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "flex-1 px-6 py-3 bg-primary-pink text-white rounded-2xl font-black hover:bg-pink-600 transition-all shadow-lg shadow-primary-pink/20 flex items-center justify-center gap-2",
                      isSubmitting && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    <span>{modalMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Data Pasien'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col md:flex-row gap-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-blue" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama, NIK, atau No. RM..." 
            className="w-full pl-12 pr-4 py-3 bg-soft-blue/30 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-blue transition-all font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-soft-blue-dark rounded-2xl text-slate-600 font-bold hover:bg-soft-blue hover:text-primary-blue transition-all shadow-sm">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Identitas Pasien</th>
                <th className="px-8 py-5">NIK</th>
                <th className="px-8 py-5">Gender/Usia</th>
                <th className="px-8 py-5">Kontak</th>
                <th className="px-8 py-5">Asuransi</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {paginatedPatients.length > 0 ? paginatedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-soft-blue/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-baby-pink flex items-center justify-center text-primary-pink font-black text-sm shadow-sm">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 group-hover:text-primary-blue transition-colors">{patient.name}</p>
                        <p className="text-[10px] text-primary-pink font-black uppercase tracking-widest mt-0.5">{patient.rm}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-bold font-mono">{patient.nik}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase",
                        patient.gender === 'L' ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
                      )}>
                        {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                      <span className="text-slate-500 font-bold">{patient.age} Thn</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-bold">{patient.phone}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      patient.insurance === 'BPJS' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-primary-pink/10 text-primary-pink border-primary-pink/20"
                    )}>
                      {patient.insurance}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => navigate(`/medical-records/${patient.id}`)}
                        className="w-9 h-9 flex items-center justify-center bg-white text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm border border-slate-100" 
                        title="Rekam Medis"
                      >
                        <ClipboardList size={18} />
                      </button>
                      <button 
                        onClick={() => handleViewPatient(patient)}
                        className="w-9 h-9 flex items-center justify-center bg-white text-slate-400 hover:text-primary-blue hover:bg-soft-blue rounded-xl transition-all shadow-sm border border-slate-100" 
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditPatient(patient)}
                        className="w-9 h-9 flex items-center justify-center bg-white text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all shadow-sm border border-slate-100" 
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(patient)}
                        className="w-9 h-9 flex items-center justify-center bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-slate-100" 
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-soft-blue rounded-full flex items-center justify-center text-primary-blue">
                        <Users size={40} />
                      </div>
                      <p className="text-slate-400 font-bold">Belum ada data pasien terdaftar.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Menampilkan <span className="text-slate-800">{paginatedPatients.length}</span> dari <span className="text-slate-800">{filteredPatients.length}</span> pasien
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-white border border-soft-blue-dark text-slate-500 rounded-xl font-bold hover:bg-soft-blue hover:text-primary-blue disabled:opacity-30 transition-all shadow-sm"
            >
              Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all shadow-sm border",
                    currentPage === page 
                      ? "bg-primary-blue text-white border-primary-blue shadow-primary-blue/30 scale-110" 
                      : "bg-white text-slate-400 border-soft-blue-dark hover:bg-soft-blue hover:text-primary-blue"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-5 py-2 bg-white border border-soft-blue-dark text-slate-500 rounded-xl font-bold hover:bg-soft-blue hover:text-primary-blue disabled:opacity-30 transition-all shadow-sm"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
