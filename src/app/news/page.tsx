import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function News() {
    return (
        <div className="flex flex-col min-h-svh w-full items-center">
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl text-primary font-bold">News</h1>
                <p>
                    This is a page where you can see the latest news. This is useful if you want to stay up to date with
                    the latest news.
                </p>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <Card className="flex flex-col gap-2 w-full">
                    <CardContent className="w-full">
                        <Button variant="link" className="text-2xl" asChild>
                            <Link href="/news/import-from-url">Import from URL</Link>
                        </Button>
                        <p>
                            This is a page where you can import a workflow from a URL. This is useful if you want to
                            import a workflow from a different source.
                        </p>
                        <Button variant="ghost" asChild>
                            <Link href="/news/import-from-url">Read more</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
