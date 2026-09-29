import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { assetIndexVisit } from '@/lib/asset-index-visit';
import type { FolderBreadcrumb } from '@/types/folder';

type FolderBreadcrumbNavProps = {
    breadcrumbs: FolderBreadcrumb[];
};

export function FolderBreadcrumbNav({ breadcrumbs }: FolderBreadcrumbNavProps) {
    return (
        <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <Link
                href="/assets"
                className="rounded-sm px-1 py-0.5 hover:bg-muted hover:text-foreground"
                {...assetIndexVisit}
            >
                Library
            </Link>
            {breadcrumbs.map((crumb) => (
                <span key={crumb.id} className="flex items-center gap-1">
                    <ChevronRight className="size-3.5" />
                    <Link
                        href={`/assets/folder/${crumb.id}`}
                        className="rounded-sm px-1 py-0.5 hover:bg-muted hover:text-foreground"
                        {...assetIndexVisit}
                    >
                        {crumb.name}
                    </Link>
                </span>
            ))}
        </nav>
    );
}
