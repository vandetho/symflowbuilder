import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create new workflow config</CardTitle>
                    <CardDescription>The best way to build and visualize workflow for symfony</CardDescription>
                </CardHeader>
                <CardContent></CardContent>
            </Card>
        </main>
    );
}
