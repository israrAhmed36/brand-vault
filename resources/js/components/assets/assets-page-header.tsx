import { Plus } from 'lucide-react';
import { AssetsLibraryTabs } from '@/components/assets/assets-library-tabs';
import { FolderBreadcrumbNav } from '@/components/assets/folder-breadcrumb';
import { Button } from '@/components/ui/button';
import type { AssetsPageHeaderProps } from '@/types/asset';

export function AssetsPageHeader({
    activeTab,
    breadcrumbs = [],
    onAddAsset,
}: AssetsPageHeaderProps) {
    const isAssets = activeTab === 'assets';

    return (
        <header className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <AssetsLibraryTabs active={activeTab} />
                {isAssets && onAddAsset ? (
                    <Button type="button" size="sm" onClick={onAddAsset}>
                        <Plus className="size-3.5" />
                        Add asset
                    </Button>
                ) : null}
            </div>

            {isAssets ? (
                <FolderBreadcrumbNav breadcrumbs={breadcrumbs} />
            ) : (
                <p className="text-sm text-muted-foreground">
                    Restore assets or delete them permanently.
                </p>
            )}
        </header>
    );
}
