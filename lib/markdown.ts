import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import rehypeParse from 'rehype-parse';

// Custom schema để cho phép các tag an toàn
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'img', 'a', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'blockquote', 'ul', 'ol', 'li',
    'strong', 'em', 'del', 'ins', 'sup', 'sub',
    'div', 'span'
  ],
  attributes: {
    ...defaultSchema.attributes,
    img: ['src', 'alt', 'title', 'width', 'height'],
    a: ['href', 'title', 'target', 'rel'],
    code: ['className'],
    pre: ['className'],
    '*': ['className', 'id']
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ['http', 'https'],
    href: ['http', 'https', 'mailto']
  }
};

export async function renderMarkdown(content: string): Promise<string> {
  // Xử lý Markdown thành HTML
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { allowDangerousHtml: true })
    .process(content);

  const htmlContent = String(result);

  // Sanitize HTML
  const sanitized = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(htmlContent);

  return String(sanitized);
}

