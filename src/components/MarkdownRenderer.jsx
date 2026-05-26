import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import '../css/Markdown.css';

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (e.g., "language-javascript")
  const language = className ? className.replace(/language-/, '') : '';
  
  // Get the code string from children
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang">{language || 'code'}</span>
        <button 
          onClick={handleCopy} 
          className={`copy-button ${copied ? 'copied' : ''}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

const MarkdownRenderer = ({ children, ...props }) => {
  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        {...props}
        components={{
          code({ node, inline, className, children, ...codeProps }) {
            // If it has a language class or is not inline, it's a code block
            const match = /language-(\w+)/.exec(className || '');
            const isCodeBlock = !inline && (match || String(children).includes('\n'));

            if (isCodeBlock) {
              return (
                <CodeBlock className={className}>
                  {children}
                </CodeBlock>
              );
            }

            return (
              <code className={className} {...codeProps}>
                {children}
              </code>
            );
          }
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
