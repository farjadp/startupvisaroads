'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Heading2, Heading3 } from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[400px] p-6 border border-[#1a1a1a]/10 rounded-b-xl max-w-none bg-white font-sans text-[#1a1a1a]',
      },
    },
  });

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.success && data.url) {
            editor?.chain().focus().setImage({ src: data.url }).run();
          } else {
            alert('Image upload failed');
          }
        } catch (error) {
          console.error(error);
          alert('Upload failed');
        }
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-1 p-2 border border-b-0 border-[#1a1a1a]/10 rounded-t-xl bg-[#1a1a1a]/[0.02]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors ${editor.isActive('bold') ? 'bg-[#1a1a1a]/10 text-black' : 'text-[#1a1a1a]/60'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors ${editor.isActive('italic') ? 'bg-[#1a1a1a]/10 text-black' : 'text-[#1a1a1a]/60'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-[#1a1a1a]/10 mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#1a1a1a]/10 text-black' : 'text-[#1a1a1a]/60'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[#1a1a1a]/10 text-black' : 'text-[#1a1a1a]/60'}`}
        >
          <Heading3 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-[#1a1a1a]/10 mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors ${editor.isActive('bulletList') ? 'bg-[#1a1a1a]/10 text-black' : 'text-[#1a1a1a]/60'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors ${editor.isActive('orderedList') ? 'bg-[#1a1a1a]/10 text-black' : 'text-[#1a1a1a]/60'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-[#1a1a1a]/10 mx-1" />
        
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors ${editor.isActive('link') ? 'bg-[#1a1a1a]/10 text-black' : 'text-[#1a1a1a]/60'}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-[#1a1a1a]/10 transition-colors text-[#1a1a1a]/60"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
