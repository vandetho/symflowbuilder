"use client";

import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { useLocalDraft } from "@/hooks/use-local-draft";
import { useAutosave } from "@/hooks/use-autosave";

export default function EditorPage() {
    const { saveDraft } = useLocalDraft("new");
    useAutosave({ onLocalSave: saveDraft });

    return (
        <div className="h-screen w-screen overflow-hidden">
            <EditorCanvas />
        </div>
    );
}
