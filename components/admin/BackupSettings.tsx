'use client';

import React, { useState } from 'react';
import { Download, Upload, CheckCircle, AlertTriangle, AlertCircle, FileJson } from 'lucide-react';

interface SelectionOption {
  key: string;
  labelEn: string;
  labelFa: string;
  descriptionEn: string;
  descriptionFa: string;
}

const BACKUP_OPTIONS: SelectionOption[] = [
  {
    key: 'articles',
    labelEn: 'Articles & Categories',
    labelFa: 'نوشته‌ها و دسته‌بندی‌ها',
    descriptionEn: 'All blog articles, categories, and tags.',
    descriptionFa: 'تمام مقالات وبلاگ، دسته‌بندی‌ها و برچسب‌ها.',
  },
  {
    key: 'contacts',
    labelEn: 'Marketing Groups & Contacts',
    labelFa: 'گروه‌ها و مخاطبان بازاریابی',
    descriptionEn: 'All contacts list, contact groups, and tags.',
    descriptionFa: 'لیست تمام مخاطبین، گروه‌های مخاطبین و تگ‌ها.',
  },
  {
    key: 'campaigns',
    labelEn: 'Campaigns & Logs',
    labelFa: 'کمپین‌ها و گزارش‌های ارسال',
    descriptionEn: 'All marketing email/SMS campaigns and tracking logs.',
    descriptionFa: 'تمام کمپین‌های پیامکی/ایمیلی و لاگ‌های رهگیری.',
  },
  {
    key: 'settings',
    labelEn: 'General & Integration Settings',
    labelFa: 'تنظیمات عمومی و اتصال‌ها',
    descriptionEn: 'LinkedIn, Twitter/X, and Facebook integration credentials.',
    descriptionFa: 'تنظیمات کلیدهای اتصالی شبکه‌های اجتماعی.',
  },
];

export default function BackupSettings() {
  const [selections, setSelections] = useState<string[]>(['articles', 'contacts', 'campaigns', 'settings']);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleSelection = (key: string) => {
    setSelections((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleExport = async () => {
    if (selections.length === 0) {
      setErrorMsg('Please select at least one item to backup. / لطفا حداقل یک مورد برای بک‌آپ انتخاب کنید.');
      return;
    }

    setExportLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/backup/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to export backup');
      }

      const backupObj = await res.json();

      // Trigger download
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupObj)
      )}`;
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `svr_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSuccessMsg('Backup generated and downloaded successfully! / فایل بک‌آپ با موفقیت ساخته و دانلود شد!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during export');
    } finally {
      setExportLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setErrorMsg('Please select a backup file (.json) first. / لطفا ابتدا فایل بک‌آپ (.json) را انتخاب کنید.');
      return;
    }

    setImportLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        try {
          const fileContent = event.target?.result as string;
          const backupObj = JSON.parse(fileContent);

          if (!backupObj || !backupObj.data) {
            throw new Error('Invalid backup file format. Missing data key.');
          }

          const res = await fetch('/api/admin/backup/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: backupObj.data }),
          });

          const importRes = await res.json();

          if (!res.ok) {
            throw new Error(importRes.error || 'Failed to restore backup');
          }

          setSuccessMsg(
            `Restore complete! Successfully updated ${importRes.recordsRestored} records. / بازیابی کامل شد! ${importRes.recordsRestored} رکورد با موفقیت بروزرسانی شدند.`
          );
          setSelectedFile(null);
          // Reset file input value
          const fileInput = document.getElementById('backup-file-input') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } catch (parseErr: any) {
          setErrorMsg(`Failed to process file: ${parseErr.message}`);
          setImportLoading(false);
        }
      };

      fileReader.readAsText(selectedFile);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during import');
      setImportLoading(false);
    } finally {
      // FileReader is async, we set loading false inside onload or on error,
      // but let's reset it here just in case.
      setTimeout(() => setImportLoading(false), 1000);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
      <div className="border-b border-[#1a1a1a]/5 pb-4">
        <h3 className="font-serif text-2xl mb-1 text-[#1a1a1a]">Backup & Restore / پشتیبان‌گیری و بازیابی</h3>
        <p className="font-sans text-xs text-[#1a1a1a]/50">
          Export your website data to a JSON backup file or restore it. Existing records with matching IDs will be updated; no data will be deleted.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-sans text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-sans text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Export options */}
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-bold text-[#1a1a1a]">Export Data / پشتیبان‌گیری</h4>
          <p className="text-xs text-[#1a1a1a]/60 font-sans">Select components you wish to include in your backup file:</p>
          
          <div className="space-y-2">
            {BACKUP_OPTIONS.map((opt) => (
              <label key={opt.key} className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-[#1a1a1a]/[0.02] border border-[#1a1a1a]/5 transition-colors">
                <input
                  type="checkbox"
                  checked={selections.includes(opt.key)}
                  onChange={() => toggleSelection(opt.key)}
                  className="rounded mt-1 focus:ring-0 focus:ring-offset-0 accent-[#1a1a1a]"
                />
                <div className="flex-1 font-sans">
                  <div className="flex justify-between items-center text-sm font-bold text-[#1a1a1a]">
                    <span>{opt.labelEn}</span>
                    <span className="font-medium text-xs text-[#1a1a1a]/60">{opt.labelFa}</span>
                  </div>
                  <div className="flex justify-between items-start text-xs text-[#1a1a1a]/40 mt-0.5 leading-relaxed">
                    <span>{opt.descriptionEn}</span>
                    <span className="text-right text-[10px]">{opt.descriptionFa}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={exportLoading || selections.length === 0}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 px-6 font-sans font-bold text-sm rounded-xl hover:bg-[#1a1a1a]/90 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exportLoading ? 'Generating Backup...' : 'Download Backup File / دانلود فایل پشتیبان'}
          </button>
        </div>

        {/* Right Column: Restore */}
        <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#1a1a1a]/5 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#1a1a1a]">Restore Data / بازیابی پشتیبان</h4>
            <p className="text-xs text-[#1a1a1a]/60 font-sans">Upload a previously generated backup JSON file to restore website records.</p>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#1a1a1a]/10 rounded-2xl p-6 bg-[#1a1a1a]/[0.01] relative hover:bg-[#1a1a1a]/[0.02] transition-colors">
              <input
                type="file"
                id="backup-file-input"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileJson className="w-10 h-10 text-[#1a1a1a]/30 mb-2" />
              {selectedFile ? (
                <div className="text-center font-sans">
                  <p className="text-sm font-bold text-[#1a1a1a]">{selectedFile.name}</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center font-sans text-xs">
                  <p className="font-bold text-[#1a1a1a]/70">Click to select backup file / انتخاب فایل بک‌آپ</p>
                  <p className="text-[#1a1a1a]/40 mt-1">Accepts SVR backup .json files only</p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-sans">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <div className="space-y-1">
                <p className="font-bold">Caution / توجه</p>
                <p className="leading-relaxed">
                  Restoring will insert new records and update existing matching records. It will NOT delete other unrelated items.
                </p>
                <p className="leading-relaxed">
                  عملیات بازیابی، اطلاعات جدید را درج کرده و رکوردهای منطبق قبلی را بروزرسانی می‌کند. هیچ داده‌ی دیگری حذف نخواهد شد.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleImport}
            disabled={importLoading || !selectedFile}
            className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white py-3 px-6 font-sans font-bold text-sm rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {importLoading ? 'Restoring Data...' : 'Restore Backup / شروع بازیابی اطلاعات'}
          </button>
        </div>
      </div>
    </div>
  );
}
