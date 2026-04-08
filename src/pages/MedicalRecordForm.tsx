import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Stethoscope, 
  FileText, 
  Activity, 
  ChevronRight,
  Save,
  Plus,
  Info,
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  Play,
  RefreshCw,
  ClipboardList,
  X,
  Send,
  Printer
} from 'lucide-react';
import { cn } from '../lib/utils';
import Odontogram from '../components/Odontogram';
import InformedConsentForm from '../components/InformedConsentForm';
import { HUMAN_NEEDS_DIAGNOSIS } from '../constants';
import { EDUCATION_MATERIALS } from '../data/education';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const MedicalRecordForm = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('anamnesis');
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) return;
      try {
        const docRef = doc(db, 'patients', patientId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPatient({ id: docSnap.id, ...docSnap.data() });
        }

        // Fetch existing medical record
        const recordRef = doc(db, 'medical_records', patientId);
        const recordSnap = await getDoc(recordRef);
        if (recordSnap.exists()) {
          const data = recordSnap.data();
          setFormData(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `patients/${patientId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  const [formData, setFormData] = useState({
    anamnesis: {
      keluhanUtama: '',
      riwayatSekarang: '',
      riwayatDahulu: '',
      riwayatAlergi: '',
      riwayatObat: ''
    },
    clinical: {
      limfe: 'Normal',
      tmj: 'Normal',
      wajah: 'Simetris',
      gingiva: '',
      mukosa: '',
      dmft: 0,
      ohis: 0,
      cpitn: 0,
      plaqueIndex: 0
    },
    odontogram: {} as Record<number, string>,
    diagnosis: [] as any[],
    consent: {
      isAgreed: false,
      patientSig: null as string | null,
      doctorSig: null as string | null
    },
    education: {
      selectedMaterials: [] as string[],
      notes: ''
    },
    treatment: {
      selectedInterventions: [] as string[],
      notes: '',
      followUp: ''
    },
    referral: {
      isNeeded: false,
      destination: '',
      reason: '',
      clinicalFindings: '',
      treatmentPerformed: '',
      date: new Date().toISOString().split('T')[0],
      doctorName: ''
    }
  });

  const handleSave = async () => {
    if (!patientId) {
      console.error('No patientId found in params');
      return;
    }
    
    console.log('Attempting to save medical record for patient:', patientId);
    setIsSubmitting(true);
    
    try {
      // Attempt to ensure user is authenticated, but don't block if it fails (using relaxed rules)
      if (!auth.currentUser) {
        console.log('User not authenticated, attempting anonymous sign-in...');
        try {
          await signInAnonymously(auth);
          console.log('Anonymous sign-in successful');
        } catch (authError) {
          console.warn('Anonymous sign-in failed, proceeding with unauthenticated save (relaxed rules):', authError);
        }
      }

      const recordRef = doc(db, 'medical_records', patientId);
      console.log('Saving data to Firestore path: medical_records/', patientId);
      
      await setDoc(recordRef, {
        ...formData,
        updatedAt: Timestamp.now()
      }, { merge: true });
      
      console.log('Save successful!');
      setNotification({ message: 'Rekam medis berhasil disimpan!', type: 'success' });
    } catch (error: any) {
      console.error('Save medical record error:', error);
      if (error.message?.includes('insufficient permissions')) {
        setNotification({ message: 'Gagal menyimpan: Izin ditolak. Pastikan Anda sudah login.', type: 'error' });
      } else {
        setNotification({ message: `Terjadi kesalahan: ${error.message || String(error)}`, type: 'error' });
      }
      handleFirestoreError(error, OperationType.WRITE, `medical_records/${patientId}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const tabs = [
    { id: 'anamnesis', label: 'Anamnesis', icon: ClipboardCheck },
    { id: 'clinical', label: 'Pemeriksaan Klinis', icon: Stethoscope },
    { id: 'odontogram', label: 'Odontogram', icon: Activity },
    { id: 'diagnosis', label: 'Diagnosis DH', icon: FileText },
    { id: 'consent', label: 'Informed Consent', icon: ShieldCheck },
    { id: 'education', label: 'Edukasi & Promosi', icon: BookOpen },
    { id: 'treatment', label: 'Rencana & Tindakan', icon: Save },
    { id: 'referral', label: 'Rujukan', icon: Send },
  ];

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && patientId) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Memuat data pasien...</div>;
  }

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
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Rekam <span className="text-primary-pink">Dental Hygiene</span></h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pasien:</span>
              <span className="text-sm font-black text-primary-blue">
                {patient ? `${patient.name} • ${patient.rm}` : 'Pilih Pasien'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className={cn(
              "px-8 py-3 bg-primary-pink text-white rounded-2xl font-black hover:bg-pink-600 transition-all shadow-lg shadow-primary-pink/20 flex items-center gap-3",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Seluruh Rekam Medis'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 rounded-2xl transition-all whitespace-nowrap font-black text-xs uppercase tracking-widest",
              activeTab === tab.id 
                ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30 scale-105" 
                : "text-slate-400 hover:text-primary-blue hover:bg-soft-blue"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 min-h-[500px]">
        {activeTab === 'anamnesis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Keluhan Utama</span>
                <textarea 
                  className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                  rows={3} 
                  placeholder="Apa yang dirasakan pasien saat ini?"
                  value={formData.anamnesis.keluhanUtama}
                  onChange={e => setFormData({...formData, anamnesis: {...formData.anamnesis, keluhanUtama: e.target.value}})}
                ></textarea>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Riwayat Penyakit Sekarang</span>
                <textarea 
                  className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                  rows={3}
                  value={formData.anamnesis.riwayatSekarang}
                  onChange={e => setFormData({...formData, anamnesis: {...formData.anamnesis, riwayatSekarang: e.target.value}})}
                ></textarea>
              </label>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Riwayat Penyakit Dahulu</span>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                  placeholder="Diabetes, Hipertensi, dll" 
                  value={formData.anamnesis.riwayatDahulu}
                  onChange={e => setFormData({...formData, anamnesis: {...formData.anamnesis, riwayatDahulu: e.target.value}})}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Riwayat Alergi</span>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                  placeholder="Alergi obat atau makanan" 
                  value={formData.anamnesis.riwayatAlergi}
                  onChange={e => setFormData({...formData, anamnesis: {...formData.anamnesis, riwayatAlergi: e.target.value}})}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Riwayat Obat</span>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                  placeholder="Obat yang sedang dikonsumsi" 
                  value={formData.anamnesis.riwayatObat}
                  onChange={e => setFormData({...formData, anamnesis: {...formData.anamnesis, riwayatObat: e.target.value}})}
                />
              </label>
            </div>
            <div className="md:col-span-2 pt-8 flex justify-end">
              <button 
                onClick={goToNextTab}
                className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
              >
                Lanjutkan ke Pemeriksaan Klinis
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'clinical' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
                Pemeriksaan Ekstra Oral
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Kelenjar Limfe</span>
                  <select 
                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    value={formData.clinical.limfe}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, limfe: e.target.value}})}
                  >
                    <option>Normal</option>
                    <option>Teraba/Bengkak</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">TMJ</span>
                  <select 
                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    value={formData.clinical.tmj}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, tmj: e.target.value}})}
                  >
                    <option>Normal</option>
                    <option>Clicking</option>
                    <option>Deviasi</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Wajah</span>
                  <select 
                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    value={formData.clinical.wajah}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, wajah: e.target.value}})}
                  >
                    <option>Simetris</option>
                    <option>Asimetris</option>
                  </select>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                <div className="w-1 h-6 bg-pink-400 rounded-full"></div>
                Pemeriksaan Intra Oral
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Gingiva</span>
                  <input 
                    type="text" 
                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                    placeholder="Warna, konsistensi, dll" 
                    value={formData.clinical.gingiva}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, gingiva: e.target.value}})}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Mukosa & Lidah</span>
                  <input 
                    type="text" 
                    className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                    value={formData.clinical.mukosa}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, mukosa: e.target.value}})}
                  />
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
                Indeks Kesehatan Gigi
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">DMF-T</p>
                  <input 
                    type="number" 
                    className="w-20 text-center text-xl font-bold rounded-lg border-slate-200 focus:ring-pink-500 focus:border-pink-500" 
                    value={formData.clinical.dmft}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, dmft: parseInt(e.target.value) || 0}})}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">OHI-S</p>
                  <input 
                    type="number" 
                    step="0.1" 
                    className="w-20 text-center text-xl font-bold rounded-lg border-slate-200 focus:ring-pink-500 focus:border-pink-500" 
                    value={formData.clinical.ohis}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, ohis: parseFloat(e.target.value) || 0}})}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">CPITN</p>
                  <input 
                    type="number" 
                    className="w-20 text-center text-xl font-bold rounded-lg border-slate-200 focus:ring-pink-500 focus:border-pink-500" 
                    value={formData.clinical.cpitn}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, cpitn: parseInt(e.target.value) || 0}})}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Plaque Index</p>
                  <input 
                    type="number" 
                    className="w-20 text-center text-xl font-bold rounded-lg border-slate-200 focus:ring-pink-500 focus:border-pink-500" 
                    value={formData.clinical.plaqueIndex}
                    onChange={e => setFormData({...formData, clinical: {...formData.clinical, plaqueIndex: parseInt(e.target.value) || 0}})}
                  />
                </div>
              </div>
            </div>
            <div className="pt-8 flex justify-end">
              <button 
                onClick={goToNextTab}
                className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
              >
                Lanjutkan ke Odontogram
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'odontogram' && (
          <div className="animate-in slide-in-from-bottom-4 duration-300 space-y-8">
            <Odontogram 
              data={formData.odontogram} 
              onChange={(data) => setFormData({ ...formData, odontogram: data })} 
            />
            <div className="pt-8 flex justify-end">
              <button 
                onClick={goToNextTab}
                className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
              >
                Lanjutkan ke Diagnosis
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'consent' && (
          <div className="animate-in slide-in-from-bottom-4 duration-300 space-y-8">
            <InformedConsentForm 
              data={formData.consent} 
              onChange={(data) => setFormData({ ...formData, consent: data })} 
            />
            <div className="pt-8 flex justify-end">
              <button 
                onClick={goToNextTab}
                className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
              >
                Lanjutkan ke Edukasi
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-slate-800">Promosi Kesehatan & Edukasi Terarah</h4>
              <button 
                onClick={() => navigate('/education')}
                className="text-pink-600 text-sm font-medium hover:underline"
              >
                Buka Perpustakaan Lengkap
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {EDUCATION_MATERIALS.map((material) => (
                <div 
                  key={material.id} 
                  className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4 group hover:bg-white hover:border-pink-200 transition-all cursor-pointer"
                  onClick={() => setSelectedMaterial(material)}
                >
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative">
                    <img src={material.imageUrl} alt={material.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {material.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play size={16} className="text-white" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-pink-600 transition-colors">{material.title}</h5>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{material.content}</p>
                    <label 
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input 
                        type="checkbox" 
                        className="rounded text-pink-500" 
                        checked={formData.education.selectedMaterials.includes(material.id)}
                        onChange={(e) => {
                          const selected = e.target.checked 
                            ? [...formData.education.selectedMaterials, material.id]
                            : formData.education.selectedMaterials.filter(id => id !== material.id);
                          setFormData({
                            ...formData,
                            education: { ...formData.education, selectedMaterials: selected }
                          });
                        }}
                      />
                      <span className="text-xs font-medium text-slate-600">Berikan ke Pasien</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-pink-50 rounded-xl border border-pink-100">
              <h5 className="font-bold text-pink-900 mb-3 flex items-center gap-2">
                <BookOpen size={18} />
                Catatan Edukasi Khusus
              </h5>
              <textarea 
                className="w-full rounded-lg border-pink-200 focus:border-pink-500 focus:ring-pink-500 text-sm" 
                rows={4} 
                placeholder="Tambahkan instruksi khusus untuk pasien ini (misal: diet rendah gula, penggunaan interdental brush)..."
                value={formData.education.notes}
                onChange={(e) => setFormData({
                  ...formData,
                  education: { ...formData.education, notes: e.target.value }
                })}
              ></textarea>
            </div>
            <div className="pt-8 flex justify-end">
              <button 
                onClick={goToNextTab}
                className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
              >
                Lanjutkan ke Rencana & Tindakan
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'diagnosis' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-3 p-4 bg-pink-50 text-pink-700 rounded-lg border border-pink-100 mb-6">
              <Info className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm">
                Diagnosis Dental Hygiene didasarkan pada <strong>8 Kebutuhan Manusia</strong> sesuai standar asuhan kesehatan gigi dan mulut.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-2">
                <h4 className="font-semibold text-slate-700 mb-4">Pilih Kebutuhan Terganggu:</h4>
                {HUMAN_NEEDS_DIAGNOSIS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedNeed(item.need)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg text-sm transition-all border",
                      selectedNeed === item.need 
                        ? "bg-pink-500 text-white border-pink-500 shadow-md" 
                        : "bg-white text-slate-600 border-slate-200 hover:border-pink-300"
                    )}
                  >
                    {item.need}
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2">
                {selectedNeed ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">{selectedNeed}</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h5 className="text-sm font-bold text-slate-500 uppercase mb-3">Penyebab (Etiologi):</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {HUMAN_NEEDS_DIAGNOSIS.find(n => n.need === selectedNeed)?.cause.map((c, i) => {
                              const diagKey = `${selectedNeed}-cause-${i}`;
                              const isChecked = formData.diagnosis.some(d => d.key === diagKey);
                              return (
                                <label key={i} className="flex items-center gap-3 p-2 hover:bg-white rounded-md transition-colors cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    className="rounded text-pink-500 focus:ring-pink-500" 
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFormData({
                                          ...formData,
                                          diagnosis: [...formData.diagnosis, { key: diagKey, need: selectedNeed, type: 'cause', value: c }]
                                        });
                                      } else {
                                        setFormData({
                                          ...formData,
                                          diagnosis: formData.diagnosis.filter(d => d.key !== diagKey)
                                        });
                                      }
                                    }}
                                  />
                                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{c}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-bold text-slate-500 uppercase mb-3">Tanda & Gejala:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {HUMAN_NEEDS_DIAGNOSIS.find(n => n.need === selectedNeed)?.signs.map((s, i) => {
                              const diagKey = `${selectedNeed}-sign-${i}`;
                              const isChecked = formData.diagnosis.some(d => d.key === diagKey);
                              return (
                                <label key={i} className="flex items-center gap-3 p-2 hover:bg-white rounded-md transition-colors cursor-pointer group">
                                  <input 
                                    type="checkbox" 
                                    className="rounded text-pink-500 focus:ring-pink-500" 
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFormData({
                                          ...formData,
                                          diagnosis: [...formData.diagnosis, { key: diagKey, need: selectedNeed, type: 'sign', value: s }]
                                        });
                                      } else {
                                        setFormData({
                                          ...formData,
                                          diagnosis: formData.diagnosis.filter(d => d.key !== diagKey)
                                        });
                                      }
                                    }}
                                  />
                                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{s}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setNotification({ message: 'Diagnosis ditambahkan ke rencana tindakan!', type: 'success' });
                          setTimeout(() => setNotification(null), 3000);
                        }}
                        className="mt-8 w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Tambahkan ke Diagnosis Pasien
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-12">
                    <FileText size={48} className="mb-4 opacity-20" />
                    <p>Pilih salah satu kebutuhan di samping untuk melihat detail diagnosis.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="pt-8 flex justify-end">
              <button 
                onClick={goToNextTab}
                className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
              >
                Lanjutkan ke Informed Consent
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-slate-800">Intervensi Terapis Gigi & Mulut (TGM)</h4>
              
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList size={20} className="text-pink-500" />
                Rencana Tindakan Berdasarkan Diagnosis
              </h4>
              
              {formData.diagnosis.length > 0 ? (
                <div className="space-y-4">
                  {Array.from(new Set(formData.diagnosis.map(d => d.need))).map(need => (
                    <div key={need} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h5 className="text-sm font-bold text-slate-700 mb-2">{need}</h5>
                      <div className="space-y-1">
                        {formData.diagnosis.filter(d => d.need === need).map((d, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded font-bold uppercase",
                              d.type === 'cause' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                            )}>
                              {d.type === 'cause' ? 'Etiologi' : 'Tanda'}
                            </span>
                            <span className="text-slate-600">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                  Belum ada diagnosis yang dipilih. Silakan isi tab Diagnosis terlebih dahulu.
                </div>
              )}
            </div>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <h5 className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-3">Promotif</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {['Edukasi Kesehatan Gigi', 'Konseling Diet & Nutrisi', 'Instruksi Kebersihan Mulut (OHI)'].map(t => (
                      <label key={t} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-white hover:border-pink-200 transition-all">
                        <input 
                          type="checkbox" 
                          className="rounded text-pink-500 focus:ring-pink-500" 
                          checked={formData.treatment.selectedInterventions.includes(t)}
                          onChange={(e) => {
                            const selected = e.target.checked 
                              ? [...formData.treatment.selectedInterventions, t]
                              : formData.treatment.selectedInterventions.filter(i => i !== t);
                            setFormData({
                              ...formData,
                              treatment: { ...formData.treatment, selectedInterventions: selected }
                            });
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-3">Preventif</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {['Scaling (Pembersihan Karang Gigi)', 'Topical Application Fluoride (TAF)', 'Fissure Sealant'].map(t => (
                      <label key={t} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-white hover:border-pink-200 transition-all">
                        <input 
                          type="checkbox" 
                          className="rounded text-pink-500 focus:ring-pink-500" 
                          checked={formData.treatment.selectedInterventions.includes(t)}
                          onChange={(e) => {
                            const selected = e.target.checked 
                              ? [...formData.treatment.selectedInterventions, t]
                              : formData.treatment.selectedInterventions.filter(i => i !== t);
                            setFormData({
                              ...formData,
                              treatment: { ...formData.treatment, selectedInterventions: selected }
                            });
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-3">Kuratif Sederhana</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {['Penambalan GIC/ART', 'Pencabutan Gigi Sulung (Mobilitas)', 'Pencabutan Gigi Sulung (Persistensi)'].map(t => (
                      <label key={t} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-white hover:border-pink-200 transition-all">
                        <input 
                          type="checkbox" 
                          className="rounded text-pink-500 focus:ring-pink-500" 
                          checked={formData.treatment.selectedInterventions.includes(t)}
                          onChange={(e) => {
                            const selected = e.target.checked 
                              ? [...formData.treatment.selectedInterventions, t]
                              : formData.treatment.selectedInterventions.filter(i => i !== t);
                            setFormData({
                              ...formData,
                              treatment: { ...formData.treatment, selectedInterventions: selected }
                            });
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Catatan Tindakan (Treatment Record)</span>
                <textarea 
                  className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                  rows={6} 
                  placeholder="Detail tindakan yang dilakukan hari ini..."
                  value={formData.treatment.notes}
                  onChange={e => setFormData({...formData, treatment: {...formData.treatment, notes: e.target.value}})}
                ></textarea>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Evaluasi & Follow-up</span>
                <textarea 
                  className="mt-1 block w-full rounded-lg border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
                  rows={3} 
                  placeholder="Rencana kunjungan berikutnya..."
                  value={formData.treatment.followUp}
                  onChange={e => setFormData({...formData, treatment: {...formData.treatment, followUp: e.target.value}})}
                ></textarea>
              </label>
            </div>
            <div className="md:col-span-2 pt-8 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSubmitting}
                className={cn(
                  "px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-3 shadow-xl shadow-emerald-100",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={24} /> : <Save size={24} />}
                {isSubmitting ? 'Sedang Menyimpan...' : 'Simpan Seluruh Rekam Medis'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'referral' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">Surat Rujukan</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lengkapi data rujukan pasien</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-pink-500 focus:ring-pink-500"
                      checked={formData.referral.isNeeded}
                      onChange={e => setFormData({...formData, referral: {...formData.referral, isNeeded: e.target.checked}})}
                    />
                    <span className="text-sm font-bold text-slate-700">Perlu Rujukan</span>
                  </label>
                </div>
              </div>

              {formData.referral.isNeeded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <label className="block">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tujuan Rujukan (RS/Spesialis)</span>
                      <input 
                        type="text" 
                        className="mt-2 block w-full rounded-2xl border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 py-3 px-4 font-bold text-slate-700" 
                        placeholder="Contoh: RSGM Universitas Padjadjaran"
                        value={formData.referral.destination}
                        onChange={e => setFormData({...formData, referral: {...formData.referral, destination: e.target.value}})}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Alasan Rujukan</span>
                      <textarea 
                        className="mt-2 block w-full rounded-2xl border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 py-3 px-4 font-bold text-slate-700" 
                        rows={4} 
                        placeholder="Alasan pasien perlu dirujuk..."
                        value={formData.referral.reason}
                        onChange={e => setFormData({...formData, referral: {...formData.referral, reason: e.target.value}})}
                      ></textarea>
                    </label>
                    <label className="block">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Temuan Klinis</span>
                      <textarea 
                        className="mt-2 block w-full rounded-2xl border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 py-3 px-4 font-bold text-slate-700" 
                        rows={4} 
                        placeholder="Temuan klinis yang relevan..."
                        value={formData.referral.clinicalFindings}
                        onChange={e => setFormData({...formData, referral: {...formData.referral, clinicalFindings: e.target.value}})}
                      ></textarea>
                    </label>
                  </div>
                  <div className="space-y-6">
                    <label className="block">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tindakan yang Telah Dilakukan</span>
                      <textarea 
                        className="mt-2 block w-full rounded-2xl border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 py-3 px-4 font-bold text-slate-700" 
                        rows={4} 
                        placeholder="Tindakan yang sudah diberikan..."
                        value={formData.referral.treatmentPerformed}
                        onChange={e => setFormData({...formData, referral: {...formData.referral, treatmentPerformed: e.target.value}})}
                      ></textarea>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Rujukan</span>
                        <input 
                          type="date" 
                          className="mt-2 block w-full rounded-2xl border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 py-3 px-4 font-bold text-slate-700" 
                          value={formData.referral.date}
                          onChange={e => setFormData({...formData, referral: {...formData.referral, date: e.target.value}})}
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Dokter/Terapis</span>
                        <input 
                          type="text" 
                          className="mt-2 block w-full rounded-2xl border-slate-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 py-3 px-4 font-bold text-slate-700" 
                          placeholder="Nama lengkap"
                          value={formData.referral.doctorName}
                          onChange={e => setFormData({...formData, referral: {...formData.referral, doctorName: e.target.value}})}
                        />
                      </label>
                    </div>
                    <div className="pt-4">
                      <button 
                        className="w-full py-4 bg-primary-blue text-white rounded-2xl font-black shadow-xl shadow-primary-blue/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                        onClick={() => setNotification({ message: 'Surat rujukan berhasil digenerate!', type: 'success' })}
                      >
                        <Printer size={20} />
                        Generate Surat Rujukan
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                  <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                    <Send size={40} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aktifkan "Perlu Rujukan" untuk mengisi data</p>
                </div>
              )}
            </div>
            <div className="pt-8 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSubmitting}
                className={cn(
                  "px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-3 shadow-xl shadow-emerald-100",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? <RefreshCw className="animate-spin" size={24} /> : <Save size={24} />}
                {isSubmitting ? 'Sedang Menyimpan...' : 'Simpan Seluruh Rekam Medis'}
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Education Detail Modal */}
      {selectedMaterial && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-pink-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 shrink-0 bg-slate-900">
              {selectedMaterial.videoUrl ? (
                <iframe 
                  src={selectedMaterial.videoUrl} 
                  title={selectedMaterial.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src={selectedMaterial.imageUrl} 
                  alt={selectedMaterial.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-4 left-4 h-10 px-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center gap-2 transition-all z-10 text-sm font-medium"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all z-10"
              >
                &times;
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full">
                  {selectedMaterial.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedMaterial.title}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">{selectedMaterial.content}</p>
              
              {selectedMaterial.steps && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-pink-500" />
                    Langkah-langkah & Instruksi:
                  </h4>
                  <div className="space-y-3">
                    {selectedMaterial.steps.map((step: string, i: number) => (
                      <div key={i} className="flex gap-4 p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                        <div className="w-8 h-8 shrink-0 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-pink-100">
                          {i + 1}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-100">
                  <Play size={20} />
                  Bagikan ke WhatsApp Pasien
                </button>
                <div className="flex gap-4">
                  <button className="px-6 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
                    Cetak Leaflet
                  </button>
                  <button 
                    onClick={() => setSelectedMaterial(null)}
                    className="px-6 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-medium"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordForm;
