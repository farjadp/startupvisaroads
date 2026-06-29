'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Users } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  color: string;
  _count: { contacts: number };
}

const COLORS = [
  '#CCFF00', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#22c55e', '#14b8a6', '#6366f1', '#f59e0b',
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', color: '#CCFF00' });
  const [editForm, setEditForm] = useState({ name: '', color: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/marketing/groups');
    const data = await res.json();
    setGroups(data.groups ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.name) return;
    setSaving(true);
    await fetch('/api/marketing/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowAdd(false);
    setForm({ name: '', color: '#CCFF00' });
    load();
  };

  const handleEdit = async (id: string) => {
    setSaving(true);
    await fetch('/api/marketing/groups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    });
    setSaving(false);
    setEditId(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this group? Contacts will not be deleted.')) return;
    await fetch('/api/marketing/groups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const startEdit = (g: Group) => {
    setEditId(g.id);
    setEditForm({ name: g.name, color: g.color });
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Contact Groups</h1>
          <p className="font-sans text-[#1a1a1a]/60">Segment your contacts for targeted campaigns.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 bg-white rounded-2xl border border-[#1a1a1a]/10 p-6 shadow-sm">
          <h3 className="font-serif text-xl mb-4">Create Group</h3>
          <div className="flex items-center gap-4 mb-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Group name"
              className="flex-1 border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
            />
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${form.color === c ? 'border-[#1a1a1a] scale-110' : 'border-white'}`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 font-sans text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a]">Cancel</button>
            <button onClick={handleAdd} disabled={saving || !form.name}
              className="px-5 py-2 bg-[#1a1a1a] text-white font-bold font-sans text-sm rounded-xl hover:bg-[#1a1a1a]/80 disabled:opacity-50">
              {saving ? 'Saving…' : 'Create Group'}
            </button>
          </div>
        </div>
      )}

      {/* Groups grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#1a1a1a]/5 p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#1a1a1a]/30" />
          </div>
          <p className="font-serif text-xl text-[#1a1a1a]/50">No groups yet</p>
          <p className="font-sans text-sm text-[#1a1a1a]/30 mt-1">Create your first group to segment contacts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 flex flex-col gap-4">
              {editId === g.id ? (
                <>
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="border border-[#1a1a1a]/10 rounded-xl px-3 py-2 font-sans text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c) => (
                      <button key={c} type="button" onClick={() => setEditForm({ ...editForm, color: c })}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${editForm.color === c ? 'border-[#1a1a1a] scale-110' : 'border-white'}`} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(g.id)} disabled={saving}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] text-white text-xs font-bold rounded-lg hover:bg-[#1a1a1a]/80 disabled:opacity-50">
                      <Check className="w-3 h-3" /> Save
                    </button>
                    <button onClick={() => setEditId(null)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-[#1a1a1a]/10 text-xs font-bold rounded-lg hover:bg-[#1a1a1a]/5">
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: g.color }} />
                    <div>
                      <p className="font-bold font-sans text-[#1a1a1a]">{g.name}</p>
                      <p className="text-xs font-sans text-[#1a1a1a]/50 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {g._count.contacts} contacts
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => startEdit(g)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-[#1a1a1a]/10 text-xs font-bold rounded-lg hover:bg-[#1a1a1a]/5 transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(g.id)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
