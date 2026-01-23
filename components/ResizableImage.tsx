'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState, useRef, useCallback } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

// Declare module để extend Commands interface
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType;
    };
  }
}

function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'width' | 'height' | 'corner' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const attrs = node.attrs as {
    src: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
    align?: 'left' | 'center' | 'right';
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, direction: 'width' | 'height' | 'corner') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    startPos.current = { x: e.clientX, y: e.clientY };

    const img = containerRef.current?.querySelector('img');
    if (img) {
      startSize.current = {
        width: img.offsetWidth,
        height: img.offsetHeight
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      const diffX = e.clientX - startPos.current.x;
      const diffY = e.clientY - startPos.current.y;

      if (direction === 'width') {
        const newWidth = Math.max(50, startSize.current.width + diffX);
        updateAttributes({ width: newWidth, height: null });
      } else if (direction === 'height') {
        const newHeight = Math.max(50, startSize.current.height + diffY);
        updateAttributes({ height: newHeight, width: null });
      } else if (direction === 'corner') {
        const newWidth = Math.max(50, startSize.current.width + diffX);
        const newHeight = Math.max(50, startSize.current.height + diffY);
        updateAttributes({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [updateAttributes]);

  const setAlign = (align: 'left' | 'center' | 'right') => {
    updateAttributes({ align });
  };

  const imageStyle: React.CSSProperties = {};
  if (attrs.width) imageStyle.width = `${attrs.width}px`;
  if (attrs.height) imageStyle.height = `${attrs.height}px`;

  // Alignment classes for wrapper
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[attrs.align || 'left'];

  return (
    <NodeViewWrapper className={`flex my-4 ${alignClass}`}>
      <div
        ref={containerRef}
        className={`relative inline-block group ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      >
        {/* Alignment toolbar - show when selected */}
        {selected && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-10">
            <button
              type="button"
              onClick={() => setAlign('left')}
              className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${attrs.align === 'left' || !attrs.align ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setAlign('center')}
              className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${attrs.align === 'center' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              type="button"
              onClick={() => setAlign('right')}
              className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${attrs.align === 'right' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>
        )}

        <img
          src={attrs.src}
          alt={attrs.alt || ''}
          title={attrs.title || ''}
          style={imageStyle}
          className="max-w-full rounded-xl block"
          draggable={false}
        />

        {/* Right edge - resize width */}
        <div
          className="absolute top-0 right-0 w-3 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end"
          onMouseDown={(e) => handleMouseDown(e, 'width')}
        >
          <div className="w-1 h-12 bg-blue-500 rounded-full mr-0.5" />
        </div>

        {/* Bottom edge - resize height */}
        <div
          className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center"
          onMouseDown={(e) => handleMouseDown(e, 'height')}
        >
          <div className="h-1 w-12 bg-blue-500 rounded-full mb-0.5" />
        </div>

        {/* Bottom-right corner - resize both */}
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end"
          onMouseDown={(e) => handleMouseDown(e, 'corner')}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-sm mb-0.5 mr-0.5" />
        </div>

        {/* Resize overlay indicator */}
        {isResizing && (
          <div className="absolute inset-0 bg-blue-500/10 pointer-events-none flex items-center justify-center">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {attrs.width ? `${Math.round(attrs.width)}` : '?'} × {attrs.height ? `${Math.round(attrs.height)}` : '?'}
            </span>
          </div>
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
      height: {
        default: null,
      },
      align: {
        default: 'left',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: (element) => {
          const img = (element as HTMLElement).querySelector('img');
          if (!img) return false;

          const divStyle = (element as HTMLElement).getAttribute('style') || '';
          let align: 'left' | 'center' | 'right' = 'left';

          if (divStyle.includes('text-align: center')) {
            align = 'center';
          } else if (divStyle.includes('text-align: right')) {
            align = 'right';
          }

          const imgStyle = img.getAttribute('style') || '';
          const widthMatch = imgStyle.match(/width:\s*(\d+)px/);
          const heightMatch = imgStyle.match(/height:\s*(\d+)px/);

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: widthMatch ? parseInt(widthMatch[1]) : null,
            height: heightMatch ? parseInt(heightMatch[1]) : null,
            align,
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (element) => {
          const img = element as HTMLElement;
          const style = img.getAttribute('style') || '';
          const widthMatch = style.match(/width:\s*(\d+)px/);
          const heightMatch = style.match(/height:\s*(\d+)px/);

          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            width: widthMatch ? parseInt(widthMatch[1]) : null,
            height: heightMatch ? parseInt(heightMatch[1]) : null,
            align: 'left',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, align, ...rest } = HTMLAttributes;
    const styles: string[] = [];
    if (width) styles.push(`width: ${width}px`);
    if (height) styles.push(`height: ${height}px`);

    // Wrap image in a div for alignment
    const alignStyle = {
      left: 'text-align: left',
      center: 'text-align: center',
      right: 'text-align: right',
    }[align || 'left'];

    return [
      'div',
      { style: alignStyle },
      [
        'img',
        mergeAttributes(rest, {
          style: styles.length > 0 ? styles.join('; ') : undefined,
          class: 'max-w-full h-auto rounded-lg my-4 inline-block',
        }),
      ],
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
