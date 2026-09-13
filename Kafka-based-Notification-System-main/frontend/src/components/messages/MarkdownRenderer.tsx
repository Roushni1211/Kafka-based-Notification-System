import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[#dadce0] dark:border-[#3c4043] bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs shadow-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#252526] border-b border-[#333333] select-none text-[11px] text-[#858585]">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#569cd6]" />
          <span className="uppercase tracking-wider font-semibold text-[#cccccc]">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#333333] text-[#cccccc] hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-green-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span className="text-[10px] font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3.5 overflow-x-auto leading-relaxed text-[12px]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Split by code blocks first
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = content.slice(lastIndex, match.index);
      parts.push(renderTextChunk(textChunk, `chunk-${lastIndex}`));
    }

    const language = match[1]?.trim() || '';
    const code = match[2];
    parts.push(
      <CodeBlock
        key={`code-${match.index}`}
        language={language}
        code={code.replace(/\n$/, '')}
      />
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const textChunk = content.slice(lastIndex);
    parts.push(renderTextChunk(textChunk, `chunk-${lastIndex}`));
  }

  return <div className={`space-y-2 leading-relaxed ${className}`}>{parts}</div>;
};

function renderTextChunk(text: string, keyPrefix: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (idx: number) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list-${idx}`} className="list-disc pl-5 space-y-1 my-2">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h4 key={`${keyPrefix}-h3-${idx}`} className="text-sm font-bold mt-3 mb-1 text-[#202124] dark:text-[#f1f3f4]">
          {renderInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h3 key={`${keyPrefix}-h2-${idx}`} className="text-base font-bold mt-4 mb-1 text-[#202124] dark:text-[#f1f3f4]">
          {renderInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h2 key={`${keyPrefix}-h1-${idx}`} className="text-lg font-bold mt-4 mb-2 text-[#202124] dark:text-[#f1f3f4]">
          {renderInline(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(idx);
      elements.push(
        <blockquote
          key={`${keyPrefix}-quote-${idx}`}
          className="border-l-3 border-[#1a73e8] pl-3 py-1 my-2 italic text-[#5f6368] dark:text-[#9aa0a6] bg-blue-50/40 dark:bg-[#1a2333]/30 rounded-r"
        >
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Bullet List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(
        <li key={`${keyPrefix}-li-${idx}`}>
          {renderInline(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Numbered List
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      flushList(idx);
      elements.push(
        <div key={`${keyPrefix}-num-${idx}`} className="flex gap-2 my-1 pl-1">
          <span className="font-semibold text-[#1a73e8] text-xs shrink-0">{numMatch[1]}.</span>
          <span>{renderInline(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Normal line or empty line
    flushList(idx);
    if (trimmed === '') {
      elements.push(<div key={`${keyPrefix}-br-${idx}`} className="h-1.5" />);
    } else {
      elements.push(
        <p key={`${keyPrefix}-p-${idx}`} className="my-1">
          {renderInline(line)}
        </p>
      );
    }
  });

  flushList(lines.length);
  return <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

// Parses inline bold, italic, code, and links
function renderInline(text: string): React.ReactNode {
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#f1f3f4] dark:bg-[#28292a] text-[#d93025] dark:text-[#f28b82] font-mono text-[0.85em] border border-black/5 dark:border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-[#202124] dark:text-[#f1f3f4]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1a73e8] dark:text-[#8ab4f8] underline hover:text-[#1557b0] transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}
