'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, X, Users } from 'lucide-react';

interface PreviewRow {
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface ContactImporterProps {
  groups: Array<{ id: string; name: string; color: string }>;
  onImportComplete?: (result: { created: number; skipped: number }) => void;
}

export default function ContactImporter({ groups, onImportComplete }: ContactImporterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [status, setStatus] = useState<'idle' | 'parsing' | 'ready' | 'importing' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<{ created: number; skipped: number; total: number } | null>(null);
  const [error, setError] = useState('');

  const parseFile = useCallback((f: File) => {
    setFile(f);
    setStatus('parsing');
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        setError('CSV must have a header row and at least one data row.');
        setStatus('error');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ''));
      const emailIdx = headers.findIndex((h) => h.includes('email'));
      const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile'));
      const nameIdx = headers.findIndex((h) => h.includes('name'));

      if (emailIdx === -1 && phoneIdx === -1) {
        setError('CSV must have an "email" or "phone" column.');
        setStatus('error');
        return;
      }

      const rows: PreviewRow[] = lines.slice(1, 11).map((line) => {
        const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
        return {
          email: emailIdx >= 0 ? cols[emailIdx] || null : null,
          phone: phoneIdx >= 0 ? cols[phoneIdx] || null : null,
          name: nameIdx >= 0 ? cols[nameIdx] || null : null,
        };
      });

      setPreview(rows);
      setError('');
      setStatus('ready');
    };
    reader.readAsText(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && (f.name.endsWith('.csv') || f.type === 'text/csv')) {
        parseFile(f);
      } else {
        setError('Please drop a CSV file.');
        setStatus('error');
      }
    },
    [parseFile],
  );

  const handleImport = async () => {
    if (!file) return;
    setStatus('importing');
    const formData = new FormData();
    formData.append('file', file);
    if (selectedGroup) formData.append('groupId', selectedGroup);

    try {
      const res = await fetch('/api/marketing/contacts/import', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const errorText = await res.text();
        throw new Error(errorText || `Server error: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) throw new Error(data.error ?? 'Import failed');
      setResult(data);
      setStatus('done');
      onImportComplete?.({ created: data.created, skipped: data.skipped });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  };

  const reset = () => {
    setFile(null);
    setPreview([]);
    setStatus('idle');
    setResult(null);
    setError('');
    setSelectedGroup('');
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {status === 'idle' || status === 'error' ? (
        <div>
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${
              isDragging
                ? 'border-[#CCFF00] bg-[#CCFF00]/10'
                : 'border-[#1a1a1a]/20 hover:border-[#1a1a1a]/40 bg-[#1a1a1a]/[0.02] hover:bg-[#1a1a1a]/5'
            }`}
          >
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) parseFile(e.target.files[0]); }}
            />
            <div className="p-4 rounded-full bg-[#1a1a1a]/5 mb-4">
              <Upload className="w-8 h-8 text-[#1a1a1a]/40" />
            </div>
            <p className="font-sans font-bold text-[#1a1a1a]">Drag & drop a CSV file here</p>
            <p className="font-sans text-sm text-[#1a1a1a]/50 mt-1">or click to browse — must include email or phone column</p>
          </label>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-sans">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Template download hint */}
          <p className="mt-3 text-xs text-[#1a1a1a]/40 font-sans">
            Expected columns: <code className="bg-[#1a1a1a]/5 px-1 rounded">name</code>,{' '}
            <code className="bg-[#1a1a1a]/5 px-1 rounded">email</code>,{' '}
            <code className="bg-[#1a1a1a]/5 px-1 rounded">phone</code>
          </p>
        </div>
      ) : null}

      {/* Parsing indicator */}
      {status === 'parsing' && (
        <div className="flex items-center gap-3 p-4 bg-[#1a1a1a]/5 rounded-xl">
          <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-sm">Parsing CSV…</span>
        </div>
      )}

      {/* Preview */}
      {(status === 'ready' || status === 'importing') && file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1a1a1a]/60" />
              <span className="font-sans text-sm font-bold">{file.name}</span>
              <span className="text-xs text-[#1a1a1a]/40">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button type="button" onClick={reset} className="p-1 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Group assignment */}
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-[#1a1a1a]/40 flex-shrink-0" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="flex-1 border border-[#1a1a1a]/10 rounded-lg px-3 py-2 text-sm font-sans bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
            >
              <option value="">No group (import without group)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Preview table */}
          <div className="border border-[#1a1a1a]/10 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-[#1a1a1a]/5 border-b border-[#1a1a1a]/10">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
                Preview (first 10 rows)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead className="bg-[#1a1a1a]/[0.02]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-[#1a1a1a]/50">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-[#1a1a1a]/50">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-[#1a1a1a]/50">Phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]/5">
                  {preview.map((row, i) => (
                    <tr key={i} className="hover:bg-[#1a1a1a]/[0.02]">
                      <td className="px-4 py-2 text-[#1a1a1a]">{row.name ?? <span className="text-[#1a1a1a]/30">—</span>}</td>
                      <td className="px-4 py-2 text-[#1a1a1a]/70">{row.email ?? <span className="text-[#1a1a1a]/30">—</span>}</td>
                      <td className="px-4 py-2 text-[#1a1a1a]/70">{row.phone ?? <span className="text-[#1a1a1a]/30">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={status === 'importing'}
            className="w-full py-3 bg-[#1a1a1a] text-white font-bold font-sans rounded-xl hover:bg-[#1a1a1a]/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'importing' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Importing…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import Contacts
              </>
            )}
          </button>
        </div>
      )}

      {/* Done */}
      {status === 'done' && result && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-green-800">Import Complete</h3>
          <div className="flex justify-center gap-6">
            <div>
              <p className="text-3xl font-bold text-green-700">{result.created}</p>
              <p className="text-sm text-green-600">Created</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-600">{result.skipped}</p>
              <p className="text-sm text-yellow-600">Skipped (duplicates)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a1a1a]/50">{result.total}</p>
              <p className="text-sm text-[#1a1a1a]/40">Total rows</p>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors"
          >
            Import another file
          </button>
        </div>
      )}
    </div>
  );
}
