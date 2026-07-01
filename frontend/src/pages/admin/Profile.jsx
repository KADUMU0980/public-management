import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { Settings, Lock, Shield, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });
  const { register: regPwd, handleSubmit: handlePwd, watch, reset: resetPwd, formState: { errors: pwdErrors } } = useForm();
  const newPwd = watch('newPassword');

  const onProfile = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await authAPI.updateProfile(data);
      updateUser(res.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };

  const onPassword = async (data) => {
    setPwdLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      resetPwd();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setPwdLoading(false); }
  };

  const tabs = [{ id: 'profile', label: '⚙️ Profile' }, { id: 'password', label: '🔒 Security' }];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your admin account</p>
      </div>

      {/* Avatar */}
      <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <p className="text-white text-xl font-bold">{user?.name}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" /> Super Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Role', value: 'Admin', icon: '🛡️' },
          { label: 'Status', value: 'Active', icon: '✅' },
          { label: 'Account', value: 'Verified', icon: '🔐' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-white font-semibold text-sm">{s.value}</p>
            <p className="text-gray-500 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/3 rounded-xl">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handleSubmit(onProfile)} className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Full Name</label>
              <input {...register('name', { required: true })} className="input-dark" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Email (Read-only)</label>
              <input value={user?.email} readOnly className="input-dark opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Phone</label>
              <input {...register('phone')} placeholder="Phone number" className="input-dark" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-semibold text-lg">Change Password</h2>
          </div>
          <form onSubmit={handlePwd(onPassword)} className="space-y-5">
            {[
              { field: 'currentPassword', label: 'Current Password' },
              { field: 'newPassword', label: 'New Password', extra: { minLength: { value: 6, message: 'Min 6 chars' } } },
              { field: 'confirmPassword', label: 'Confirm New Password', extra: { validate: v => v === newPwd || 'Passwords do not match' } },
            ].map(({ field, label, extra }) => (
              <div key={field}>
                <label className="text-gray-300 text-sm font-medium mb-2 block">{label}</label>
                <input {...regPwd(field, { required: 'Required', ...extra })} type="password" className="input-dark" placeholder="••••••••" />
                {pwdErrors[field] && <p className="text-red-400 text-xs mt-1">{pwdErrors[field].message}</p>}
              </div>
            ))}
            <button type="submit" disabled={pwdLoading} className="btn-primary w-full flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              {pwdLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-5 h-5" /> Change Password</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
