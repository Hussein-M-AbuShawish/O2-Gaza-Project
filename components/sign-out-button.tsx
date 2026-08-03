"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";

export function SignOutButton() {
    return (
        <form action={signOut}>
            <Button
                type="submit"
                variant="outline"
                className="gap-2 border-border bg-transparent hover:bg-muted"
            >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
            </Button>
        </form>
    );
}
