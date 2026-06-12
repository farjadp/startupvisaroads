'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';

export default function CategoriesClient({ initialCategories }: any) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  
  // Track inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const refreshData = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to refresh categories:', err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsAdding(true);
    setError('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      const data = await res.json();

      if (res.ok) {
        setNewName('');
        await refreshData();
        router.refresh();
      } else {
        setError(data.error || 'Failed to create category');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (category: any) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setError('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    setError('');

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editingName })
      });
      const data = await res.json();

      if (res.ok) {
        setEditingId(null);
        setEditingName('');
        await refreshData();
        router.refresh();
      } else {
        setError(data.error || 'Failed to update category');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDeleteCategory = async (category: any) => {
    const articleCount = category._count?.articles || 0;
    const confirmMessage = articleCount > 0
      ? `WARNING: This category contains ${articleCount} articles. Deleting it will leave these articles uncategorized (no category). Are you sure you want to delete "${category.name}"?`
      : `Are you sure you want to delete the category "${category.name}"?`;

    if (!confirm(confirmMessage)) return;
    setError('');

    try {
      const res = await fetch(`/api/admin/categories?id=${category.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok) {
        await refreshData();
        router.refresh();
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl text-sm font-sans">
          {error}
        </div>
      )}

      {/* Add New Category Form */}
      <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
        <label className="block font-sans text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 mb-2">
          Create New Category
        </label>
        <div className="flex gap-4">
          <input
            required
            type="text"
            placeholder="e.g. Canada Startup Visa"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-grow bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00]"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="bg-[#1a1a1a] text-[#F2F0E9] px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      {/* Categories Listing Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-[#1a1a1a]/5 text-[#1a1a1a]/60 uppercase tracking-widest text-[10px]">
            <tr>
              <th className="px-6 py-4 font-bold">Category Name</th>
              <th className="px-6 py-4 font-bold">URL Slug</th>
              <th className="px-6 py-4 font-bold text-center">Linked Articles</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/5">
            {categories.map((category: any) => {
              const isEditing = editingId === category.id;
              return (
                <tr key={category.id} className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1a1a1a]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-white border border-[#1a1a1a]/20 rounded-lg px-3 py-1.5 w-full max-w-xs focus:outline-none focus:border-[#CCFF00]"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#1a1a1a]/60 font-mono text-xs">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-[#1a1a1a]">
                    {category._count?.articles || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(category.id)}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="p-2 hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/60 hover:text-[#1a1a1a] rounded-lg transition-colors cursor-pointer"
                            title="Rename"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#1a1a1a]/40 italic">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
