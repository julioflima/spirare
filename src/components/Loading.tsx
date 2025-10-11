import { ReactNode } from "react";

interface LoadingProps {
    children?: ReactNode;
}

export function Loading({ children }: LoadingProps) {
    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-xl">
            <div
                className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-300/80 border-t-transparent"
                aria-hidden="true"
            />
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-800/80">
                {children}
            </p>
        </div>
    );
}