import { auth } from "@/auth";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) return null;

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <h1 className="text-2xl font-light text-[var(--text-primary)]">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt=""
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full"
                            />
                        )}
                        <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                                {session.user.name}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
