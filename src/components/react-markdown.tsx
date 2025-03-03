import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark, duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';

interface ReactMarkdownProps {
    children: string | undefined | null;
}

export const ReactMarkdown = React.memo<ReactMarkdownProps>(({ children }) => {
    const { theme, systemTheme } = useTheme();
    const [isCopied, setCopied] = React.useState(false);

    const handleCopy = React.useCallback(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, []);
    console.log(children);
    return (
        <Markdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkDirective]}
            components={{
                code(props: React.ComponentPropsWithoutRef<any>) {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <React.Fragment>
                            <div
                                className={`flex flex-row items-center justify-between ${
                                    theme === 'light'
                                        ? 'bg-neutral-50'
                                        : theme === 'system'
                                          ? systemTheme === 'light'
                                              ? 'bg-neutral-50'
                                              : 'bg-gray-900'
                                          : 'bg-gray-900'
                                } bg pl-2`}
                            >
                                <p className="capitalize">{match[1]}</p>
                                <CopyToClipboard text={children} onCopy={handleCopy}>
                                    <Button variant="ghost">
                                        {isCopied ? (
                                            <Icon icon="ci:check" className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Icon icon="octicon:paste-16" className="mr-2 h-4 w-4" />
                                        )}
                                        {isCopied ? 'Copied!' : 'Copy'}
                                    </Button>
                                </CopyToClipboard>
                            </div>
                            <SyntaxHighlighter
                                {...rest}
                                PreTag="div"
                                language={match[1]}
                                style={
                                    theme === 'light'
                                        ? duotoneLight
                                        : theme === 'system'
                                          ? systemTheme === 'light'
                                              ? duotoneLight
                                              : coldarkDark
                                          : coldarkDark
                                }
                                showLineNumbers
                                wrapLongLines
                                showInlineLineNumbers
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </React.Fragment>
                    ) : (
                        <code
                            {...rest}
                            className={className}
                            style={{ backgroundColor: 'rgb(17, 27, 39)', color: '#FFFFFF' }}
                        >
                            {children}
                        </code>
                    );
                },
            }}
        >
            {children}
        </Markdown>
    );
});

ReactMarkdown.displayName = 'ReactMarkdown';
