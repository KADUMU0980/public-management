import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { User, Mail, Phone, Lock, Save, Camera, MapPin } from 'lucide-react';

export default function CitizenProfile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone, street: user?.address?.street, city: user?.address?.city, state: user?.address?.state, pincode: user?.address?.pincode }
  });

  const { register: regPwd, handleSubmit: handlePwd, formState: { errors: pwdErrors }, watch, reset: resetPwd } = useForm();
  const newPwd = watch('newPassword');

  const onProfile = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await authAPI.updateProfile({ name: data.name, phone: data.phone, address: { street: data.street, city: data.city, state: data.state, pincode: data.pincode } });
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

  const tabs = [{ id: 'profile', label: '👤 Profile' }, { id: 'password', label: '🔒 Password' }, { id: 'notifications', label: '🔔 Notifications' }];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="glass-card rounded-2xl p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-3xl font-bold text-white shadow-glow-blue">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 transition-colors">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        <div>
          <p className="text-white text-xl font-bold">{user?.name}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${user?.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {user?.isVerified ? '✅ Verified' : '⚠️ Unverified'}
            </span>
            <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">Citizen</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/3 rounded-xl">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === t.id ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handleSubmit(onProfile)} className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Full Name</label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input {...register('name', { required: true })} className="input-dark pl-11" />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Email (Read-only)</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input value={user?.email} readOnly className="input-dark pl-11 opacity-60 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Phone Number</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input {...register('phone')} placeholder="Your phone number" className="input-dark pl-11" />
              </div>
            </div>
            <div className="border-t border-white/5 pt-5">
              <p className="text-gray-400 text-sm font-medium mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" /> Address</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-gray-400 text-xs mb-1 block">Street</label>
                  <input {...register('street')} placeholder="Street" className="input-dark text-sm" /></div>
                <div><label className="text-gray-400 text-xs mb-1 block">City</label>
                  <input {...register('city')} placeholder="City" className="input-dark text-sm" /></div>
                <div><label className="text-gray-400 text-xs mb-1 block">State</label>
                  <input {...register('state')} placeholder="State" className="input-dark text-sm" /></div>
                <div><label className="text-gray-400 text-xs mb-1 block">Pincode</label>
                  <input {...register('pincode')} placeholder="Pincode" className="input-dark text-sm" /></div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handlePwd(onPassword)} className="space-y-5">
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
              <div key={field}>
                <label className="text-gray-300 text-sm font-medium mb-2 block">
                  {['Current Password', 'New Password', 'Confirm New Password'][i]}
                </label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input {...regPwd(field, { required: true, ...(field === 'confirmPassword' ? { validate: v => v === newPwd || 'Passwords do not match' } : {}), ...(field === 'newPassword' ? { minLength: { value: 6, message: 'Min 6 chars' } } : {}) })}
                    type="password" className="input-dark pl-11" placeholder="••••••••" />
                </div>
                {pwdErrors[field] && <p className="text-red-400 text-xs mt-1">{pwdErrors[field].message || 'Required'}</p>}
              </div>
            ))}
            <button type="submit" disabled={pwdLoading} className="btn-primary w-full flex items-center justify-center gap-2">
              {pwdLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-5 h-5" /> Change Password</>}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 text-sm">Manage your notification preferences</p>
          {[{ key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' }, { key: 'statusUpdates', label: 'Status Updates', desc: 'When complaint status changes' }, { key: 'announcements', label: 'Announcements', desc: 'Government announcements' }].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/3">
              <div><p className="text-white font-medium">{label}</p><p className="text-gray-400 text-sm">{desc}</p></div>
              <div className={`w-12 h-6 rounded-full bg-primary-600 relative cursor-pointer`}>
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
