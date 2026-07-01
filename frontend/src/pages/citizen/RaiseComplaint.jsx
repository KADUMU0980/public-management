import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { complaintAPI } from '../../services/api';
import { MapPin, Upload, X, Crosshair, AlertCircle, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const CATEGORIES = ['Potholes', 'Garbage', 'Water Leakage', 'Broken Streetlights', 'Sewage', 'Road Damage', 'Drainage', 'Illegal Dumping', 'Public Property Damage', 'Traffic Signal', 'Others'];
const PRIORITIES = [{ v: 'low', l: '🟢 Low', d: 'Minor issue, can wait' }, { v: 'medium', l: '🟡 Medium', d: 'Needs attention soon' }, { v: 'high', l: '🟠 High', d: 'Urgent issue' }, { v: 'emergency', l: '🔴 Emergency', d: 'Immediate action required' }];

export default function RaiseComplaint() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [detectingLoc, setDetectingLoc] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { priority: 'medium' } });

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 5
  });

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const detectLocation = () => {
    setDetectingLoc(true);
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Location detected!');
        setDetectingLoc(false);
      },
      () => { toast.error('Could not detect location'); setDetectingLoc(false); }
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      formData.append('address', JSON.stringify({
        street: data.street, area: data.area, city: data.city, state: data.state,
        pincode: data.pincode, fullAddress: `${data.street}, ${data.area}, ${data.city}, ${data.state}`
      }));
      if (location) {
        formData.append('location', JSON.stringify({ type: 'Point', coordinates: [location.lng, location.lat] }));
      }
      images.forEach(img => formData.append('images', img));

      await complaintAPI.createComplaint(formData);
      toast.success('Complaint submitted successfully! 🎉');
      navigate('/citizen/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Raise a Complaint</h1>
        <p className="text-gray-400 text-sm mt-1">Fill in the details below to submit your civic complaint</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Details */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-lg border-b border-white/5 pb-3">Complaint Details</h2>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Complaint Title *</label>
            <input {...register('title', { required: 'Title required', minLength: { value: 5, message: 'Min 5 characters' } })}
              placeholder="Brief title of the issue" className="input-dark" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium mb-2 block">Description *</label>
            <textarea {...register('description', { required: 'Description required', minLength: { value: 20, message: 'Min 20 characters' } })}
              rows={4} placeholder="Provide detailed description of the issue..." className="input-dark resize-none" />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Category *</label>
              <select {...register('category', { required: 'Category required' })} className="input-dark">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Priority *</label>
              <select {...register('priority', { required: true })} className="input-dark">
                {PRIORITIES.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
              </select>
            </div>
          </div>

          {/* Priority Info */}
          {watch('priority') === 'emergency' && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">Emergency complaints are escalated immediately to relevant authorities.</p>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-white font-semibold text-lg border-b border-white/5 pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-400" /> Location Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Street / Landmark</label>
              <input {...register('street')} placeholder="Street name or landmark" className="input-dark" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Area / Locality *</label>
              <input {...register('area', { required: 'Area required' })} placeholder="Area or locality name" className="input-dark" />
              {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area.message}</p>}
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">City *</label>
              <input {...register('city', { required: 'City required' })} placeholder="City name" className="input-dark" />
              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">State</label>
              <input {...register('state')} placeholder="State" className="input-dark" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Pincode</label>
              <input {...register('pincode')} placeholder="PIN code" className="input-dark" />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={detectLocation} disabled={detectingLoc}
                className="w-full btn-secondary flex items-center justify-center gap-2">
                {detectingLoc ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Crosshair className="w-4 h-4" />}
                {detectingLoc ? 'Detecting...' : 'Auto Detect'}
              </button>
            </div>
          </div>

          {location && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-400" />
              <p className="text-green-300 text-sm">📍 Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-lg border-b border-white/5 pb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary-400" /> Upload Images (Optional)
          </h2>
          <p className="text-gray-400 text-sm">Upload up to 5 images of the issue. Clear images help faster resolution.</p>

          <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-primary-500/50 hover:bg-white/3'}`}>
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-300 font-medium">Drop images here or click to browse</p>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 10MB each (max 5)</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img src={img.preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !py-4 text-lg">
          {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-5 h-5" /> Submit Complaint</>}
        </button>
      </form>
    </div>
  );
}
