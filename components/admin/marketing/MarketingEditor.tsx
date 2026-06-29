'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback, useState } from 'react';
import {
  Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Quote, Code, Minus, Undo, Redo, Strikethrough, Underline as UnderlineIcon,
  Eye, Code2, Type,
} from 'lucide-react';

interface MarketingEditorProps {
  content: string;
  onChange: (html: string) => void;
  minHeight?: number;
}

// We use inline styles for text-align via HTML marks since we can't import
// @tiptap/extension-text-align without installing it separately.
// The existing tiptap stack has StarterKit + Image + Link — we extend with colour.

const PRESET_COLORS = [
  '#1a1a1a', '#374151', '#6b7280', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899',
];

type ViewMode = 'editor' | 'preview' | 'html';

export default function MarketingEditor({ content, onChange, minHeight = 500 }: MarketingEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [htmlSource, setHtmlSource] = useState(content);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlSource(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose-base focus:outline-none p-6 max-w-none bg-white font-sans text-[#1a1a1a]`,
        style: `min-height:${minHeight}px`,
      },
    },
  });

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success && data.url) {
          editor?.chain().focus().setImage({ src: data.url }).run();
        }
      } catch {}
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const prev = editor?.getAttributes('link').href;
    const url = window.prompt('URL', prev);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const applyHtmlSource = () => {
    editor?.commands.setContent(htmlSource);
    onChange(htmlSource);
    setViewMode('editor');
  };

  const ToolBtn = ({
    onClick, active, title, children,
  }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors text-sm ${
        active
          ? 'bg-[#1a1a1a] text-white'
          : 'hover:bg-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-[#1a1a1a]/10 mx-0.5 self-center" />;

  if (!editor) return null;

  return (
    <div className="border border-[#1a1a1a]/10 rounded-xl overflow-hidden bg-white flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-[#1a1a1a]/10 bg-[#F2F0E9]/60 p-2 flex flex-wrap items-center gap-0.5">
        {/* History */}
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="w-4 h-4" />
        </ToolBtn>
        <Divider />

        {/* Headings */}
        <ToolBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Paragraph" active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}>
          <Type className="w-4 h-4" />
        </ToolBtn>
        <Divider />

        {/* Formatting */}
        <ToolBtn title="Bold" active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Italic" active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Strikethrough" active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Code" active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="w-4 h-4" />
        </ToolBtn>
        <Divider />

        {/* Lists */}
        <ToolBtn title="Bullet List" active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Ordered List" active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Blockquote" active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Code Block" active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code2 className="w-4 h-4" />
        </ToolBtn>
        <Divider />

        {/* Align (via paragraph attributes) */}
        <ToolBtn title="Align Left"
          onClick={() => editor.chain().focus().setNode('paragraph', { textAlign: 'left' }).run()}>
          <AlignLeft className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Align Center"
          onClick={() => editor.chain().focus().setNode('paragraph', { textAlign: 'center' }).run()}>
          <AlignCenter className="w-4 h-4" />
        </ToolBtn>
        <ToolBtn title="Align Right"
          onClick={() => editor.chain().focus().setNode('paragraph', { textAlign: 'right' }).run()}>
          <AlignRight className="w-4 h-4" />
        </ToolBtn>
        <Divider />

        {/* Horizontal Rule */}
        <ToolBtn title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </ToolBtn>

        {/* Link */}
        <ToolBtn title="Link" active={editor.isActive('link')} onClick={setLink}>
          <LinkIcon className="w-4 h-4" />
        </ToolBtn>

        {/* Image */}
        <ToolBtn title="Insert Image" onClick={addImage}>
          <ImageIcon className="w-4 h-4" />
        </ToolBtn>

        {/* Color picker */}
        <div className="relative">
          <button
            type="button"
            title="Text Color"
            onClick={() => setShowColorPicker((v) => !v)}
            className="p-1.5 rounded hover:bg-[#1a1a1a]/10 transition-colors flex items-center gap-1"
          >
            <span className="text-xs font-bold text-[#1a1a1a]/60 select-none">A</span>
            <span className="w-3 h-1 rounded-full bg-current block" />
          </button>
          {showColorPicker && (
            <div className="absolute top-8 left-0 z-50 bg-white border border-[#1a1a1a]/10 rounded-xl p-3 shadow-xl flex flex-wrap gap-2 w-48">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    // Apply via mark — wrap in span
                    const { from, to } = editor.state.selection;
                    if (from === to) return;
                    editor.chain().focus().setMark('textStyle', { color: c }).run();
                    setShowColorPicker(false);
                  }}
                  style={{ backgroundColor: c }}
                  className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition-transform"
                />
              ))}
              <button
                type="button"
                onClick={() => { editor.chain().focus().unsetAllMarks().run(); setShowColorPicker(false); }}
                className="w-full text-xs text-[#1a1a1a]/40 hover:text-[#1a1a1a] mt-1"
              >
                Clear formatting
              </button>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View mode toggles */}
        <div className="flex border border-[#1a1a1a]/10 rounded-lg overflow-hidden">
          {(['editor', 'preview', 'html'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                viewMode === mode
                  ? 'bg-[#1a1a1a] text-white'
                  : 'hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/50'
              }`}
            >
              {mode === 'editor' ? <><Eye className="w-3 h-3 inline mr-1" />Edit</> : null}
              {mode === 'preview' ? <><Eye className="w-3 h-3 inline mr-1" />Preview</> : null}
              {mode === 'html' ? <><Code2 className="w-3 h-3 inline mr-1" />HTML</> : null}
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview / HTML */}
      {viewMode === 'editor' && (
        <EditorContent editor={editor} className="flex-1" />
      )}

      {viewMode === 'preview' && (
        <div
          className="prose prose-sm sm:prose-base p-6 max-w-none bg-white font-sans"
          style={{ minHeight: `${minHeight}px` }}
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      )}

      {viewMode === 'html' && (
        <div className="flex flex-col flex-1">
          <textarea
            value={htmlSource}
            onChange={(e) => setHtmlSource(e.target.value)}
            className="flex-1 font-mono text-xs p-4 bg-[#1a1a1a] text-[#CCFF00] resize-none focus:outline-none"
            style={{ minHeight: `${minHeight}px` }}
            spellCheck={false}
          />
          <div className="p-3 border-t border-[#1a1a1a]/10 flex justify-end">
            <button
              type="button"
              onClick={applyHtmlSource}
              className="px-4 py-2 bg-[#CCFF00] text-[#1a1a1a] text-sm font-bold rounded-lg hover:bg-[#b8e600] transition-colors"
            >
              Apply HTML
            </button>
          </div>
        </div>
      )}

      {/* Footer: char count */}
      <div className="border-t border-[#1a1a1a]/5 px-4 py-2 flex justify-between text-xs text-[#1a1a1a]/30 font-sans bg-[#F2F0E9]/40">
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} characters</span>
        <span>{editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
}
