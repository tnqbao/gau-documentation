'use client';

import { Mark, mergeAttributes } from '@tiptap/core';

// Enhanced inline code với màu sắc đẹp
export const EnhancedCode = Mark.create({
  name: 'code',

  excludes: '_',

  code: true,

  exitable: true,

  parseHTML() {
    return [{ tag: 'code' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'code',
      mergeAttributes(HTMLAttributes, {
        class: 'inline-code bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-sm font-mono border border-pink-200 hover:bg-pink-100 transition-colors relative',
        'data-code': 'inline',
      }),
      0,
    ];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-e': () => this.editor.commands.toggleCode(),
    };
  },
});

export default EnhancedCode;

