'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useCallback } from 'react';

interface ImageNodeViewProps {
  node: {
    attrs: {
      src: string;
      alt?: string;
      title?: string;
      width?: number;
    };
  };
  updateAttributes: (attrs: Record<string, unknown>) => void;
  selected: boolean;
}

function ImageNodeView({ node, updateAttributes, selected }: ImageNodeViewProps) {
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = imageRef.current?.offsetWidth || 300;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(100, Math.min(startWidth.current + diff, 1200));
      updateAttributes({ width: newWidth });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateAttributes]);

  return (
    <NodeViewWrapper className="relative inline-block my-4">
      <div
        className={`relative inline-block ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          title={node.attrs.title || ''}
          style={{ width: node.attrs.width ? `${node.attrs.width}px` : 'auto' }}
          className="max-w-full h-auto rounded-lg block"
          draggable={false}
        />
        {/* Resize handles */}
        <div
          className="absolute top-0 right-0 w-4 h-full cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-full" />
        </div>
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          onMouseDown={handleMouseDown}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-sm" />
        </div>
        {isResizing && (
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const ResizableImage = Node.create({
  name: 'image',

  group: 'block',

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, ...rest } = HTMLAttributes;
    return [
      'img',
      mergeAttributes(rest, {
        style: width ? `width: ${width}px` : undefined,
        class: 'max-w-full h-auto rounded-lg my-4',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },

  addCommands() {
    return {
      setImage:
        (options: { src: string; alt?: string; title?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default ResizableImage;

