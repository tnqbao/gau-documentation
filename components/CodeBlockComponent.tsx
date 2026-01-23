'use client';

import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

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

export default function CodeBlockComponent({ node, updateAttributes }: NodeViewProps) {
  const [copied, setCopied] = useState(false);
  const language = node.attrs.language || 'plaintext';
  const colors = LANGUAGE_COLORS[language.toLowerCase()] || DEFAULT_COLOR;

  const handleCopy = () => {
    const codeElement = document.querySelector(`[data-node-view-wrapper] pre code`);
    const code = codeElement?.textContent || '';

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

        {/* Code content */}
        <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
          <NodeViewContent as="code" className="language-{language}" />
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
