import React, { useEffect, useState } from 'react';
import { categoryAPI } from '../../services/api';
import { Tag, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/Loading';
import { useForm } from 'react-hook-form';

const ICONS = ['🕳️', '🗑️', '💧', '💡', '🚰', '🛣️', '🌊', '⚠️', '🏗️', '🚦', '📋', '🌿', '🔌', '🏫', '🏥'];
const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#FBBF24', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#10B981', '#6B7280'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: { icon: '📋', color: '#3B82F6', isActive: true } });

  const load = async () => {
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data.categories);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await categoryAPI.update(editing._id, data);
        toast.success('Category updated');
      } else {
        await categoryAPI.create(data);
        toast.success('Category created');
      }
      setShowForm(false);
      setEditing(null);
      reset();
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await categoryAPI.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (cat) => {
    try {
      await categoryAPI.update(cat._id, { isActive: !cat.isActive });
      toast.success(`Category ${cat.isActive ? 'disabled' : 'enabled'}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const startEdit = (cat) => {
    setEditing(cat);
    Object.keys(cat).forEach(k => setValue(k, cat[k]));
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-primary-400" /> Categories
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage complaint categories</p>
        </div>
        <button onClick={() => { setEditing(null); reset(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 border border-primary-500/30 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">{editing ? 'Edit Category' : 'Create Category'}</h3>
            <button onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Category Name *</label>
                <input {...register('name', { required: true })} placeholder="e.g. Potholes" className="input-dark" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Department</label>
                <input {...register('department')} placeholder="e.g. Public Works" className="input-dark" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Icon</label>
                <div className="flex flex-wrap gap-2 p-3 bg-dark-800 rounded-xl border border-white/10">
                  {ICONS.map(icon => (
                    <button key={icon} type="button" onClick={() => setValue('icon', icon)}
                      className={`text-2xl p-1 rounded-lg transition-all ${watch('icon') === icon ? 'bg-primary-500/30 scale-125' : 'hover:bg-white/10'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Color</label>
                <div className="flex flex-wrap gap-2 p-3 bg-dark-800 rounded-xl border border-white/10">
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setValue('color', color)}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${watch('color') === color ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-800 scale-110' : ''}`}
                      style={{ background: color }}>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Description</label>
              <textarea {...register('description')} rows={2} placeholder="Brief description..." className="input-dark resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Check className="w-4 h-4" /> {editing ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset(); }} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? <LoadingSpinner /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className={`glass-card rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] ${!cat.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{cat.icon}</div>
                <div className="flex gap-1">
                  <button onClick={() => toggleActive(cat)}
                    className={`p-1.5 rounded-lg transition-colors ${cat.isActive ? 'text-green-400 hover:bg-green-500/20' : 'text-gray-500 hover:bg-white/10'}`}>
                    {cat.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg text-primary-400 hover:bg-primary-500/20 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCategory(cat._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color }}></div>
                <p className="text-white font-semibold">{cat.name}</p>
              </div>
              {cat.department && <p className="text-gray-400 text-xs mb-1">🏢 {cat.department}</p>}
              {cat.description && <p className="text-gray-500 text-xs line-clamp-2">{cat.description}</p>}
              <div className="mt-3">
                <span className={`text-xs px-2 py-1 rounded-full ${cat.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
                  {cat.isActive ? '● Active' : '● Disabled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
