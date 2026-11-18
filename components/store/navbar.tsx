"use client";

import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-100">
            Obsidian Studio
          </span>
        </div>

        <nav className="flex items-center gap-3">
          <Show when="signed-in">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100">
              My Orders
            </Button>
            <UserButton />
          </Show>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              >
                Sign In
              </Button>
            </SignInButton>
          </Show>
        </nav>
      </div>
    </header>
  );
}
