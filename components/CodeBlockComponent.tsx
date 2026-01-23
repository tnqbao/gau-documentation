'use client';

import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { Copy, Check, Palette } from 'lucide-react';

// Màu sắc cho từng loại ngôn ngữ
const LANGUAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  javascript: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  typescript: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  jsx: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
  tsx: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
  html: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  css: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  scss: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  python: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  java: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  php: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  bash: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  shell: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  cmd: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  json: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  xml: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  sql: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  go: { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300' },
  rust: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  ruby: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  cpp: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  c: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  csharp: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
  swift: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  kotlin: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  dart: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
};

const DEFAULT_COLOR = { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };

// Các màu có sẵn cho code block
const CODE_COLORS = [
  { name: 'Default', bg: '#1a1a1a', text: '#e5e5e5' },
  { name: 'Monokai', bg: '#272822', text: '#f8f8f2' },
  { name: 'Dracula', bg: '#282a36', text: '#f8f8f2' },
  { name: 'Nord', bg: '#2e3440', text: '#eceff4' },
  { name: 'Solarized Dark', bg: '#002b36', text: '#839496' },
  { name: 'GitHub Dark', bg: '#0d1117', text: '#c9d1d9' },
  { name: 'One Dark', bg: '#282c34', text: '#abb2bf' },
  { name: 'Night Owl', bg: '#011627', text: '#d6deeb' },
  { name: 'Cobalt', bg: '#193549', text: '#ffffff' },
  { name: 'Material', bg: '#263238', text: '#eeffff' },
  { name: 'Atom Dark', bg: '#1d1f21', text: '#c5c8c6' },
  { name: 'Twilight', bg: '#141414', text: '#f8f8f8' },
  { name: 'Ocean', bg: '#1c2f3f', text: '#dfe9f2' },
  { name: 'Forest', bg: '#1a2f1a', text: '#d4f4d4' },
  { name: 'Sunset', bg: '#2a1a1a', text: '#ffd4d4' },
];

export default function CodeBlockComponent({ node, updateAttributes }: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const language = node.attrs.language || 'plaintext';
  const colors = LANGUAGE_COLORS[language.toLowerCase()] || DEFAULT_COLOR;

  // Lấy màu tùy chỉnh từ node attributes hoặc dùng màu mặc định
  const customBgColor = node.attrs.bgColor || '#1a1a1a';
  const customTextColor = node.attrs.textColor || '#e5e5e5';

  const handleCopy = () => {
    const codeElement = document.querySelector(`[data-node-view-wrapper] pre code`);
    const code = codeElement?.textContent || '';

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleColorChange = (bgColor: string, textColor: string) => {
    updateAttributes({ bgColor, textColor });
    setShowColorPicker(false);
  };

  return (
    <NodeViewWrapper className="code-block relative my-4 group">
      <div className={`rounded-2xl overflow-hidden border-2 ${colors.border}`}>
        {/* Header with language badge and copy button */}
        <div className={`flex items-center justify-between px-4 py-2 ${colors.bg} border-b ${colors.border}`}>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase ${colors.text}`}>
              {language}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Color picker button */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${colors.text} hover:bg-white/50`}
                title="Change colors"
              >
                <Palette size={14} />
                <span>Colors</span>
              </button>

              {showColorPicker && (
                <div className="absolute top-full right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-2xl z-50 p-3 min-w-[200px]">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Choose Theme</div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {CODE_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color.bg, color.text)}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex gap-1">
                          <div
                            className="w-5 h-5 rounded border border-gray-300"
                            style={{ backgroundColor: color.bg }}
                          />
                          <div
                            className="w-5 h-5 rounded border border-gray-300"
                            style={{ backgroundColor: color.text }}
                          />
                        </div>
                        <span className="text-xs text-gray-700">{color.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Custom Colors</div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 block mb-1">Background</label>
                        <input
                          type="color"
                          value={customBgColor}
                          onChange={(e) => updateAttributes({ bgColor: e.target.value })}
                          className="w-full h-8 rounded border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-600 block mb-1">Text</label>
                        <input
                          type="color"
                          value={customTextColor}
                          onChange={(e) => updateAttributes({ textColor: e.target.value })}
                          className="w-full h-8 rounded border border-gray-300 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="mt-3 w-full px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : `${colors.text} hover:bg-white/50`
              }`}
              title="Copy code"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code content với màu tùy chỉnh */}
        <pre
          className="p-4 overflow-x-auto"
          style={{
            backgroundColor: customBgColor,
            color: customTextColor
          }}
        >
          <NodeViewContent className={`language-${language}`} />
        </pre>
      </div>

      {/* Language selector for editing (hidden in view mode) */}
      <select
        contentEditable={false}
        value={language}
        onChange={(e) => updateAttributes({ language: e.target.value })}
        className="absolute top-2 right-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-300 rounded px-2 py-1 text-xs"
      >
        <option value="plaintext">Plain Text</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="jsx">JSX</option>
        <option value="tsx">TSX</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="scss">SCSS</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="php">PHP</option>
        <option value="bash">Bash</option>
        <option value="shell">Shell</option>
        <option value="cmd">CMD</option>
        <option value="json">JSON</option>
        <option value="xml">XML</option>
        <option value="sql">SQL</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="ruby">Ruby</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="csharp">C#</option>
        <option value="swift">Swift</option>
        <option value="kotlin">Kotlin</option>
        <option value="dart">Dart</option>
      </select>
    </NodeViewWrapper>
  );
}
