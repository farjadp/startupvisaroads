'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Search, Download, Tag, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import ContactImporter from '@/components/admin/marketing/ContactImporter';

interface Contact {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  tags: string;
  createdAt: string;
  group: { id: string; name: string; color: string } | null;
}

interface Group {
  id: string;
  name: string;
  color: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', groupId: '' });
  const [saving, setSaving] = useState(false);

  const LIMIT = 50;
  const totalPages = Math.ceil(total / LIMIT);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set('search', search);
    if (filterGroup) params.set('groupId', filterGroup);
    const res = await fetch(`/api/marketing/contacts?${params}`);
    const data = await res.json();
    setContacts(data.contacts ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  };

  const loadGroups = async () => {
    const res = await fetch('/api/marketing/groups');
    const data = await res.json();
    setGroups(data.groups ?? []);
  };

  useEffect(() => { loadGroups(); }, []);
  useEffect(() => { load(); }, [page, search, filterGroup]);

  const handleAdd = async () => {
    if (!form.email && !form.phone) return;
    setSaving(true);
    await fetch('/api/marketing/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowAdd(false);
    setForm({ name: '', email: '', phone: '', groupId: '' });
    load();
  };

  const handleDelete = async () => {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} contact(s)?`)) return;
    await fetch('/api/marketing/contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setSelected(new Set());
    load();
  };

  const handleExport = () => {
    const rows = contacts.filter((c) => selected.size === 0 || selected.has(c.id));
    const csv = [
      'name,email,phone,group',
      ...rows.map((c) => `"${c.name ?? ''}","${c.email ?? ''}","${c.phone ?? ''}","${c.group?.name ?? ''}"`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === contacts.length) setSelected(new Set());
    else setSelected(new Set(contacts.map((c) => c.id)));
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Contacts</h1>
          <p className="font-sans text-[#1a1a1a]/60">{total} contacts total</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a]/10 bg-white font-sans text-sm font-bold rounded-xl hover:bg-[#1a1a1a]/5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a]/10 bg-white font-sans text-sm font-bold rounded-xl hover:bg-[#1a1a1a]/5 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] text-white font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/80 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* Add Contact Form */}
      {showAdd && (
        <div className="mb-6 bg-white rounded-2xl border border-[#1a1a1a]/10 p-6 shadow-sm">
          <h3 className="font-serif text-xl mb-4">Add New Contact</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name" className="border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address" type="email" className="border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number (e.g. +14155552671)" className="border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20" />
            <select value={form.groupId} onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              className="border border-[#1a1a1a]/10 rounded-xl px-4 py-3 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20">
              <option value="">No group</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 font-sans text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a]">Cancel</button>
            <button onClick={handleAdd} disabled={saving || (!form.email && !form.phone)}
              className="px-5 py-2 bg-[#1a1a1a] text-white font-bold font-sans text-sm rounded-xl hover:bg-[#1a1a1a]/80 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Contact'}
            </button>
          </div>
        </div>
      )}

      {/* Import */}
      {showImport && (
        <div className="mb-6 bg-white rounded-2xl border border-[#1a1a1a]/10 p-6 shadow-sm">
          <h3 className="font-serif text-xl mb-4">Import Contacts from CSV</h3>
          <ContactImporter groups={groups} onImportComplete={() => { load(); setShowImport(false); }} />
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/40" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search contacts…"
            className="w-full pl-9 pr-4 py-2.5 border border-[#1a1a1a]/10 rounded-xl font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
          />
        </div>
        <select
          value={filterGroup}
          onChange={(e) => { setFilterGroup(e.target.value); setPage(1); }}
          className="border border-[#1a1a1a]/10 rounded-xl px-4 py-2.5 font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
        >
          <option value="">All groups</option>
          {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        {selected.size > 0 && (
          <button onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 font-bold font-sans text-sm rounded-xl hover:bg-red-100 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete {selected.size}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead className="bg-[#1a1a1a]/[0.03] border-b border-[#1a1a1a]/5">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={selected.size === contacts.length && contacts.length > 0}
                  onChange={toggleAll} className="rounded" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Email</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Group</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#1a1a1a]/50 uppercase tracking-widest">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 bg-[#1a1a1a]/5 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
              : contacts.map((c) => (
                <tr key={c.id} className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 font-bold text-[#1a1a1a]">{c.name ?? <span className="text-[#1a1a1a]/30">—</span>}</td>
                  <td className="px-4 py-3 text-[#1a1a1a]/70">{c.email ?? <span className="text-[#1a1a1a]/30">—</span>}</td>
                  <td className="px-4 py-3 text-[#1a1a1a]/70">{c.phone ?? <span className="text-[#1a1a1a]/30">—</span>}</td>
                  <td className="px-4 py-3">
                    {c.group ? (
                      <span className="flex items-center gap-1.5 w-fit text-xs px-2 py-1 rounded-full font-bold text-white" style={{ backgroundColor: c.group.color }}>
                        <Tag className="w-3 h-3" /> {c.group.name}
                      </span>
                    ) : <span className="text-[#1a1a1a]/30">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[#1a1a1a]/40 text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            {!loading && contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#1a1a1a]/40 italic">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-[#1a1a1a]/5 px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-sans text-[#1a1a1a]/50">
              {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg hover:bg-[#1a1a1a]/5 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-sans">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-[#1a1a1a]/5 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
