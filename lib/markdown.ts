import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export async function renderMarkdown(content: string): Promise<string> {
  // Kiểm tra xem content có phải là HTML hay không
  // Nếu bắt đầu bằng tag HTML thì trả về trực tiếp
  const trimmedContent = content.trim();
  if (trimmedContent.startsWith('<') && !trimmedContent.startsWith('<!')) {
    // Content đã là HTML (từ Tiptap editor)
    return content;
  }

  // Nếu là Markdown thì convert sang HTML
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHtml, { allowDangerousHtml: true })
    .process(content);

  return String(result);
}
