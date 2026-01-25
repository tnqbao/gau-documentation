'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { TextStyle, FontFamily, FontSize, Color } from '@tiptap/extension-text-style';
import { createLowlight } from 'lowlight';
import { useCallback, useEffect, useState, useRef } from 'react';
import ResizableImage from './ResizableImage';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CodeBlockComponent from './CodeBlockComponent';

// Import các ngôn ngữ từ highlight.js
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import dart from 'highlight.js/lib/languages/dart';
import bash from 'highlight.js/lib/languages/bash';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Undo,
  Redo,
  Type,
  ChevronDown,
  ALargeSmall,
  GripVertical,
  Palette,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const lowlight = createLowlight();

// Đăng ký các ngôn ngữ
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('python', python);
lowlight.register('java', java);
lowlight.register('cpp', cpp);
lowlight.register('csharp', csharp);
lowlight.register('php', php);
lowlight.register('ruby', ruby);
lowlight.register('go', go);
lowlight.register('rust', rust);
lowlight.register('swift', swift);
lowlight.register('kotlin', kotlin);
lowlight.register('dart', dart);
lowlight.register('bash', bash);
lowlight.register('shell', shell);
lowlight.register('sql', sql);
lowlight.register('json', json);
lowlight.register('xml', xml);
lowlight.register('css', css);
lowlight.register('scss', scss);

// Danh sách font chữ
const FONT_FAMILIES = [
  { name: 'Default', value: '' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Courier New', value: 'Courier New' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS' },
  { name: 'Impact', value: 'Impact' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Montserrat', value: 'Montserrat' },
];

// Màu sắc phổ biến
const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
  '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
  '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
  '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
  '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
  '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
  '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#741B47',
  '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130',
];

interface NotionEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export default function NotionEditor({ content, onChange, editable = true }: NotionEditorProps) {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [fontSize, setFontSizeValue] = useState('16');
  const [isDragging, setIsDragging] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 20, y: 20 });
  const [toolbarSize, setToolbarSize] = useState<{ width: number; height: number | 'auto' }>({ width: 350, height: 'auto' });
  const [isResizing, setIsResizing] = useState<'horizontal' | 'vertical' | 'diagonal' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toolbarScale, setToolbarScale] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 350, height: 0 });

  // Upload image to Object Storage
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', 'documents');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      ResizableImage,
      Placeholder.configure({
        placeholder: 'Start writing, or press "/" for commands...',
      }),
      Underline,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-100 p-2 font-semibold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-2',
        },
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
        addAttributes() {
          return {
            ...this.parent?.(),
            bgColor: {
              default: '#1a1a1a',
              parseHTML: element => element.getAttribute('data-bg-color'),
              renderHTML: attributes => {
                return {
                  'data-bg-color': attributes.bgColor,
                };
              },
            },
            textColor: {
              default: '#e5e5e5',
              parseHTML: element => element.getAttribute('data-text-color'),
              renderHTML: attributes => {
                return {
                  'data-text-color': attributes.textColor,
                };
              },
            },
          };
        },
      }).configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[200px] p-6 sm:p-8',
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              uploadImage(file).then((url) => {
                if (url && editor) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              });
            }
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        if (moved) return false;

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            uploadImage(file).then((url) => {
              if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            });
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle inline code copy on click
  useEffect(() => {
    const handleCodeClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'CODE' && !target.closest('pre')) {
        const codeText = target.textContent || '';
        navigator.clipboard.writeText(codeText).then(() => {
          target.classList.add('code-copied');
          setTimeout(() => {
            target.classList.remove('code-copied');
          }, 1000);
        });
      }
    };

    document.addEventListener('click', handleCodeClick);
    return () => document.removeEventListener('click', handleCodeClick);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFontMenu(false);
      setShowColorPicker(false);
    };
    if (showFontMenu || showColorPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showFontMenu, showColorPicker]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - toolbarPosition.x,
      y: e.clientY - toolbarPosition.y,
    };
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, direction: 'horizontal' | 'vertical' | 'diagonal') => {
    e.stopPropagation();
    setIsResizing(direction);
    const toolbarEl = toolbarRef.current;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: toolbarEl?.offsetWidth || 350,
      height: toolbarEl?.offsetHeight || 0,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setToolbarPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y,
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        if (isResizing === 'horizontal' || isResizing === 'diagonal') {
          const newWidth = Math.max(250, Math.min(800, resizeStart.current.width + deltaX));
          setToolbarSize(prev => ({ ...prev, width: newWidth }));
        }

        if (isResizing === 'vertical' || isResizing === 'diagonal') {
          const newHeight = Math.max(200, Math.min(800, resizeStart.current.height + deltaY));
          setToolbarSize(prev => ({ ...prev, height: newHeight }));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const setFontFamily = useCallback((fontFamily: string) => {
    if (editor) {
      if (fontFamily === '') {
        editor.chain().focus().unsetFontFamily().run();
      } else {
        editor.chain().focus().setFontFamily(fontFamily).run();
      }
    }
    setShowFontMenu(false);
  }, [editor]);

  const handleFontSizeChange = useCallback((size: string) => {
    if (editor) {
      const numSize = parseInt(size);
      if (numSize > 0 && numSize <= 200) {
        editor.chain().focus().setFontSize(`${numSize}px`).run();
      }
    }
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
    setShowColorPicker(false);
  }, [editor]);

  const getCurrentFont = () => {
    if (!editor) return 'Default';
    const fontFamily = editor.getAttributes('textStyle').fontFamily;
    const found = FONT_FAMILIES.find(f => f.value === fontFamily);
    return found?.name || 'Default';
  };

  if (!editor) {
    return <div className="animate-pulse bg-gray-100 h-64 rounded-lg" />;
  }

  const ToolButton = ({
    onClick,
    isActive = false,
    children,
    title
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      {editable && (
        <div
          ref={toolbarRef}
          className="fixed z-50 bg-white border-2 border-gray-300 rounded-xl shadow-2xl"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            width: `${toolbarSize.width}px`,
            height: toolbarSize.height === 'auto' ? 'auto' : `${toolbarSize.height}px`,
            maxHeight: toolbarSize.height === 'auto' ? 'none' : `${toolbarSize.height}px`,
            overflowY: toolbarSize.height === 'auto' ? 'visible' : 'auto',
            cursor: isDragging ? 'grabbing' : 'default',
            transform: `scale(${toolbarScale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Drag Handle */}
          <div
            className="flex items-center justify-between p-2 bg-gray-100 rounded-t-xl border-b border-gray-300 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <GripVertical size={16} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-700">Formatting Tools</span>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-200 rounded"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <ChevronDown size={14} /> : <X size={14} />}
            </button>
          </div>

          {/* Toolbar Content */}
          {!isCollapsed && (
            <div className="p-2 w-full overflow-y-auto" style={{ maxHeight: toolbarSize.height === 'auto' ? 'none' : `${(toolbarSize.height as number) - 50}px` }}>
              <div className="flex flex-wrap gap-2 items-center w-full">
                {/* Group 1: Undo/Redo */}
                <div className="flex flex-wrap gap-1 items-center">
                <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                  <Undo size={16} />
                </ToolButton>
                <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                  <Redo size={16} />
                </ToolButton>
                </div>

                <div className="w-px h-6 bg-gray-300" />

                {/* Group 2: Font & Size */}
                <div className="flex flex-wrap gap-1 items-center">
                {/* Font Family */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFontMenu(!showFontMenu);
                      setShowColorPicker(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-xs min-w-[80px]"
                    title="Font"
                  >
                    <Type size={14} />
                    <span className="truncate text-xs">{getCurrentFont()}</span>
                    <ChevronDown size={12} />
                  </button>
                  {showFontMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] max-h-[200px] overflow-y-auto">
                      {FONT_FAMILIES.map((font) => (
                        <button
                          key={font.name}
                          type="button"
                          onClick={() => setFontFamily(font.value)}
                          className={`w-full text-left px-2 py-1.5 text-xs hover:bg-gray-100 ${
                            getCurrentFont() === font.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                          style={{ fontFamily: font.value || 'inherit' }}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Font Size Input */}
                <div className="flex items-center gap-1">
                  <ALargeSmall size={14} className="text-gray-500" />
                  <input
                    type="number"
                    min="8"
                    max="200"
                    value={fontSize}
                    onChange={(e) => {
                      setFontSizeValue(e.target.value);
                      handleFontSizeChange(e.target.value);
                    }}
                    className="w-14 px-1.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    title="Font Size"
                  />
                </div>

                {/* Color Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPicker(!showColorPicker);
                      setShowFontMenu(false);
                    }}
                    className="p-1.5 rounded hover:bg-gray-100"
                    title="Text Color"
                  >
                    <Palette size={16} />
                  </button>
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 w-48">
                      <div className="grid grid-cols-10 gap-1">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setTextColor(color)}
                            className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                </div>

                <div className="w-px h-6 bg-gray-300" />

              {/* Group 3: Text Formatting */}
              <div className="flex flex-wrap gap-1 items-center">
                <ToolButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive('bold')}
                  title="Bold"
                >
                  <Bold size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive('italic')}
                  title="Italic"
                >
                  <Italic size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  isActive={editor.isActive('underline')}
                  title="Underline"
                >
                  <UnderlineIcon size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  isActive={editor.isActive('strike')}
                  title="Strike"
                >
                  <Strikethrough size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  isActive={editor.isActive('highlight')}
                  title="Highlight"
                >
                  <Highlighter size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  isActive={editor.isActive('code')}
                  title="Code"
                >
                  <Code size={16} />
                </ToolButton>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Group 4: Headings */}
              <div className="flex flex-wrap gap-1 items-center">
                <ToolButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  isActive={editor.isActive('heading', { level: 1 })}
                  title="H1"
                >
                  <Heading1 size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  isActive={editor.isActive('heading', { level: 2 })}
                  title="H2"
                >
                  <Heading2 size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  isActive={editor.isActive('heading', { level: 3 })}
                  title="H3"
                >
                  <Heading3 size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                  isActive={editor.isActive('heading', { level: 4 })}
                  title="H4"
                >
                  <Heading4 size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                  isActive={editor.isActive('heading', { level: 5 })}
                  title="H5"
                >
                  <Heading5 size={16} />
                </ToolButton>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Group 5: Lists */}
              <div className="flex flex-wrap gap-1 items-center">
                <ToolButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  isActive={editor.isActive('bulletList')}
                  title="Bullet List"
                >
                  <List size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  isActive={editor.isActive('orderedList')}
                  title="Numbered List"
                >
                  <ListOrdered size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  isActive={editor.isActive('blockquote')}
                  title="Quote"
                >
                  <Quote size={16} />
                </ToolButton>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Group 6: Alignment */}
              <div className="flex flex-wrap gap-1 items-center">
                <ToolButton
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  isActive={editor.isActive({ textAlign: 'left' })}
                  title="Left"
                >
                  <AlignLeft size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  isActive={editor.isActive({ textAlign: 'center' })}
                  title="Center"
                >
                  <AlignCenter size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  isActive={editor.isActive({ textAlign: 'right' })}
                  title="Right"
                >
                  <AlignRight size={16} />
                </ToolButton>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Group 7: Insert */}
              <div className="flex flex-wrap gap-1 items-center">
                <ToolButton onClick={addLink} isActive={editor.isActive('link')} title="Link">
                  <LinkIcon size={16} />
                </ToolButton>
                <ToolButton onClick={addImage} title="Image URL">
                  <ImageIcon size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Image"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  )}
                </ToolButton>
                <ToolButton onClick={addTable} title="Table">
                  <TableIcon size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  title="HR"
                >
                  <Minus size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  isActive={editor.isActive('codeBlock')}
                  title="Code Block"
                >
                  <Code size={16} />
                </ToolButton>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Group 8: Zoom */}
              <div className="flex flex-wrap gap-1 items-center">
                <ToolButton
                  onClick={() => {
                    setToolbarScale((prev) => Math.min(prev + 0.1, 2));
                  }}
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </ToolButton>
                <ToolButton
                  onClick={() => {
                    setToolbarScale((prev) => Math.max(prev - 0.1, 0.5));
                  }}
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </ToolButton>
              </div>
              </div>
            </div>
          )}

          {/* Resize Handles */}
          {!isCollapsed && (
            <>
              {/* Right edge - horizontal resize */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize bg-transparent hover:bg-blue-300 hover:opacity-50 transition-all"
                onMouseDown={(e) => handleResizeStart(e, 'horizontal')}
                style={{ zIndex: 10 }}
              />

              {/* Bottom edge - vertical resize */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize bg-transparent hover:bg-blue-300 hover:opacity-50 transition-all"
                onMouseDown={(e) => handleResizeStart(e, 'vertical')}
                style={{ zIndex: 10 }}
              />

              {/* Bottom-right corner - diagonal resize */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize bg-gray-200 hover:bg-blue-300 transition-colors rounded-tl opacity-60 hover:opacity-100"
                onMouseDown={(e) => handleResizeStart(e, 'diagonal')}
                style={{ zIndex: 20 }}
              />
            </>
          )}
        </div>
      )}

      {/* Editor Content */}
      <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            uploadImage(file).then((url) => {
              if (url && editor) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            });
          }
        }}
        className="hidden"
      />
    </div>
  );
}
