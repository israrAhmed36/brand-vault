import { GalleryVerticalEnd } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const SPLASH_HOLD_MS = 1200;
const SPLASH_FADE_MS = 350;

type AppSplashScreenProps = {
    onFinished?: () => void;
};

export function AppSplashScreen({ onFinished }: AppSplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const [isProgressReady, setIsProgressReady] = useState(false);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setIsProgressReady(true);
        });

        const exitTimer = window.setTimeout(() => {
            setIsExiting(true);
        }, SPLASH_HOLD_MS);

        const hideTimer = window.setTimeout(() => {
            setIsVisible(false);
            onFinished?.();
        }, SPLASH_HOLD_MS + SPLASH_FADE_MS);

        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(exitTimer);
            window.clearTimeout(hideTimer);
        };
    }, [onFinished]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={cn(
                'fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-zinc-900 text-white transition-opacity duration-300',
                isExiting && 'opacity-0',
            )}
            aria-hidden={isExiting}
            role="status"
            aria-label="BrandVault loading"
        >
            <img
                src="/images/auth-cover.svg"
                alt=""
                className="absolute inset-0 h-full w-full scale-105 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />

            <div className="relative flex flex-col items-center gap-6 px-6">
                <div className="relative">
                    <span
                        aria-hidden
                        className="absolute -inset-3 animate-ping rounded-2xl bg-white/10 [animation-duration:1.5s]"
                    />
                    <span className="relative flex size-16 animate-in items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-black/40 duration-500 zoom-in-95 fade-in">
                        <GalleryVerticalEnd className="size-7" />
                    </span>
                </div>

                <div className="animate-in space-y-2 text-center duration-700 fill-mode-both fade-in slide-in-from-bottom-2">
                    <p className="text-2xl font-semibold tracking-tight">
                        BrandVault
                    </p>
                    <p className="text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
                        Brand kit workspace
                    </p>
                </div>

                <div className="mt-1 h-0.5 w-28 overflow-hidden rounded-full bg-white/15">
                    <div
                        className={cn(
                            'h-full w-full origin-left rounded-full bg-white/85 transition-transform duration-1000 ease-out',
                            isProgressReady ? 'scale-x-100' : 'scale-x-0',
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
