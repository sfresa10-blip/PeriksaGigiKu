import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Save, 
  RefreshCw, 
  Lock,
  Camera,
  CheckCircle2,
  Trash2,
  Smartphone,
  Globe,
  LogOut,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase';
import { 
  updateProfile, 
  updatePassword, 
  updateEmail, 
  deleteUser, 
  linkWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profileData, setProfileData] = useState({
    displayName: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    role: '',
    phone: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData(prev => ({
            ...prev,
            role: data.role || 'Staff',
            phone: data.phone || '',
            bio: data.bio || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Update Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: profileData.displayName,
        phone: profileData.phone,
        bio: profileData.bio
      });

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal memperbarui profil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak sesuai.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    
    try {
      await updatePassword(auth.currentUser, passwordData.newPassword);
      setMessage({ type: 'success', text: 'Password berhasil diperbarui!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal memperbarui password. Anda mungkin perlu login ulang.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!auth.currentUser?.email) return;
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setMessage({ type: 'success', text: 'Email reset password telah dikirim!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal mengirim email reset.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    setIsDeleting(true);
    try {
      await deleteUser(auth.currentUser);
      window.location.href = '/';
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal menghapus akun. Anda mungkin perlu login ulang.' });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLinkGoogle = async () => {
    if (!auth.currentUser) return;
    try {
      const provider = new GoogleAuthProvider();
      await linkWithPopup(auth.currentUser, provider);
      setMessage({ type: 'success', text: 'Akun Google berhasil ditautkan!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal menautkan akun Google.' });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Keamanan', icon: Lock },
    { id: 'devices', label: 'Perangkat', icon: Smartphone },
    { id: 'management', label: 'Manajemen', icon: Shield },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Pengaturan <span className="text-primary-pink">Akun</span></h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola informasi profil dan keamanan akun Anda</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summary Card */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-baby-pink flex items-center justify-center text-primary-pink text-4xl font-black shadow-inner border-4 border-white overflow-hidden">
                {profileData.displayName.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-blue/30 hover:scale-110 transition-transform border-4 border-white">
                <Camera size={18} />
              </button>
            </div>
            <h3 className="text-xl font-black text-slate-800 mt-6 tracking-tight">{profileData.displayName || 'User'}</h3>
            <p className="text-xs font-bold text-primary-pink uppercase tracking-widest mt-1">{profileData.role}</p>
            
            <div className="w-full h-px bg-slate-50 my-6" />
            
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Status Akun</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full font-black uppercase tracking-tighter">Aktif</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Email Terverifikasi</span>
                <span className="text-emerald-500"><CheckCircle2 size={16} /></span>
              </div>
            </div>
          </div>

          <div className="bg-primary-blue p-8 rounded-[2.5rem] shadow-xl shadow-primary-blue/20 text-white relative overflow-hidden group">
            <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
            <h4 className="text-lg font-black tracking-tight relative z-10">Keamanan Akun</h4>
            <p className="text-xs font-bold text-white/70 mt-2 relative z-10 leading-relaxed">
              Pastikan Anda menggunakan password yang kuat dan unik untuk melindungi data pasien Anda.
            </p>
          </div>
        </div>

        {/* Right Column: Form Area */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-white h-full">
            {message && (
              <div className={cn(
                "mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300",
                message.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm",
                  message.type === 'success' ? "bg-white text-emerald-500" : "bg-white text-rose-500"
                )}>
                  {message.type === 'success' ? <CheckCircle2 size={18} /> : <Shield size={18} />}
                </div>
                <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
                      <input 
                        type="text"
                        className="w-full pl-12 pr-4 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
                      <input 
                        type="email"
                        disabled
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                        value={profileData.email}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Telepon</label>
                    <input 
                      type="text"
                      className="w-full px-5 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700"
                      placeholder="0812xxxx"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                    <input 
                      type="text"
                      disabled
                      className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                      value={profileData.role}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio / Deskripsi</label>
                  <textarea 
                    className="w-full px-5 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700 min-h-[120px]"
                    placeholder="Tuliskan sedikit tentang Anda..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className={cn(
                      "px-8 py-4 bg-primary-pink text-white rounded-2xl font-black shadow-xl shadow-primary-pink/20 hover:bg-pink-600 transition-all flex items-center gap-3 text-xs uppercase tracking-widest",
                      isSaving && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <form onSubmit={handlePasswordUpdate} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
                        <input 
                          type="password"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700"
                          placeholder="••••••••"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-pink" size={18} />
                        <input 
                          type="password"
                          required
                          className="w-full pl-12 pr-4 py-3.5 bg-soft-blue/30 border-none rounded-2xl focus:ring-2 focus:ring-primary-pink transition-all outline-none font-bold text-slate-700"
                          placeholder="••••••••"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] font-black text-primary-pink uppercase tracking-widest hover:underline"
                    >
                      Lupa Password?
                    </button>
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className={cn(
                        "px-8 py-4 bg-primary-blue text-white rounded-2xl font-black shadow-xl shadow-primary-blue/20 hover:bg-blue-600 transition-all flex items-center gap-3 text-xs uppercase tracking-widest",
                        isSaving && "opacity-70 cursor-not-allowed"
                      )}
                    >
                      {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                      Perbarui Password
                    </button>
                  </div>
                </form>

                <div className="pt-8 border-t border-slate-50">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-6">Tautkan Akun</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={handleLinkGoogle}
                      className="flex items-center justify-between p-6 bg-white border-2 border-soft-blue rounded-2xl hover:bg-soft-blue transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                        <div className="text-left">
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Google</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tautkan akun Google Anda</p>
                        </div>
                      </div>
                      <LinkIcon size={18} className="text-slate-300 group-hover:text-primary-blue" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Perangkat Terhubung</h4>
                  <button 
                    onClick={() => setMessage({ type: 'success', text: 'Berhasil keluar dari semua perangkat lain.' })}
                    className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                  >
                    Keluar dari Semua Perangkat
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'MacBook Pro 14"', location: 'Jakarta, ID', status: 'Perangkat Ini', icon: Smartphone, current: true },
                    { name: 'iPhone 13 Pro', location: 'Bandung, ID', status: 'Aktif 2 jam yang lalu', icon: Smartphone, current: false },
                    { name: 'Chrome on Windows', location: 'Surabaya, ID', status: 'Aktif kemarin', icon: Globe, current: false },
                  ].map((device, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-6 rounded-2xl border transition-all",
                      device.current ? "bg-emerald-50 border-emerald-100" : "bg-soft-blue/30 border-soft-blue-dark"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                          device.current ? "bg-white text-emerald-500" : "bg-white text-primary-blue"
                        )}>
                          <device.icon size={24} />
                        </div>
                        <div>
                          <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">{device.name}</h5>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{device.location} • {device.status}</p>
                        </div>
                      </div>
                      {!device.current && (
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-all">
                          <LogOut size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'management' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Manajemen Akun</h4>
                  
                  <div className="p-8 bg-rose-50 rounded-[2rem] border border-rose-100">
                    <h5 className="text-sm font-black text-rose-600 uppercase tracking-tight mb-2">Hapus Akun</h5>
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-widest leading-relaxed mb-6">
                      Menghapus akun Anda akan menghapus semua data yang terkait secara permanen. Tindakan ini tidak dapat dibatalkan.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
                      >
                        Hapus Akun Saya
                      </button>
                    ) : (
                      <div className="space-y-4 animate-in zoom-in-95 duration-300">
                        <p className="text-xs font-black text-rose-700 uppercase tracking-tight">Apakah Anda benar-benar yakin?</p>
                        <div className="flex gap-3">
                          <button 
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="px-6 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                          >
                            {isDeleting ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
                            Ya, Hapus Permanen
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-6 py-3 bg-white text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-rose-100"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 p-6 bg-slate-100 text-slate-600 rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs group"
                  >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    Keluar dari Sesi Ini
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
