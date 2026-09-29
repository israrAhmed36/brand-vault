import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';

export function AppearanceModeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    function handleToggle(): void {
        updateAppearance(isDark ? 'light' : 'dark');
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0 border-border bg-background text-foreground shadow-xs hover:bg-muted"
            onClick={handleToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}
