import { Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { ExploreGrid } from "./ExploreGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
    title: "Explore Public Workflows — SymFlowBuilder",
    description:
        "Browse publicly shared Symfony workflow configurations built by the community.",
};

export default async function ExplorePage() {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar activePath="/explore" session={session} />

            {/* ─── Header ─── */}
            <section className="relative px-6 pt-14 pb-8">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(124,111,247,0.1) 0%, transparent 70%)",
                    }}
                />
                <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-4">
                    <Badge variant="default" className="text-[10px] gap-1.5">
                        <Compass className="w-3 h-3" />
                        Community
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-light text-[var(--text-primary)] tracking-tight">
                        Explore Public <span className="font-medium">Workflows</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-md">
                        Browse Symfony workflow configurations shared by the community.
                        Open any workflow in the editor or export its YAML directly.
                    </p>
                </div>
            </section>

            {/* ─── Grid ─── */}
            <section className="flex-1 px-6 pb-16">
                <div className="max-w-5xl mx-auto">
                    <ExploreGrid isAuthenticated={!!session?.user} />
                </div>
            </section>

            <Footer />
        </div>
    );
}
