import { cn } from '@/lib/utils';
import type { AssetsPageShellProps } from '@/types/ui';

const shellHeight =
    'h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)] md:group-has-data-[collapsible=icon]/sidebar-wrapper:h-[calc(100svh-4rem)]';

export function AssetsPageShell({ sidebar, children }: AssetsPageShellProps) {
    return (
        <div
            className={cn(
                'flex min-h-0 flex-col overflow-hidden md:flex-row',
                shellHeight,
            )}
        >
            {sidebar ? (
                <aside className="sticky top-0 z-20 flex max-h-72 min-h-0 w-full shrink-0 flex-col overflow-hidden border-b border-sidebar-border bg-sidebar md:static md:h-full md:max-h-none md:w-72 md:self-stretch md:border-r md:border-b-0">
                    {sidebar}
                </aside>
            ) : null}
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="flex flex-col gap-5 p-4 md:p-6">{children}</div>
            </div>
        </div>
    );
}
