import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    MAX_PENDING_ASSET_FILES,
    createPendingAssetFile,
    revokePendingAssetFiles,
} from '@/lib/pending-asset-files';
import type { PendingAssetFile } from '@/types/asset-form';

export function usePendingAssetFiles(isOpen: boolean, assetId: number | null) {
    const [files, setFiles] = useState<PendingAssetFile[]>([]);
    const filesRef = useRef(files);
    filesRef.current = files;

    useEffect(() => {
        setFiles((current) => {
            revokePendingAssetFiles(current);

            return [];
        });
    }, [isOpen, assetId]);

    useEffect(
        () => () => {
            revokePendingAssetFiles(filesRef.current);
        },
        [],
    );

    function addFiles(
        incoming: File[],
        allowMultiple: boolean,
    ): PendingAssetFile[] {
        if (!allowMultiple) {
            const created = incoming.slice(0, 1).map(createPendingAssetFile);

            setFiles((current) => {
                revokePendingAssetFiles(current);

                return created;
            });

            return created;
        }

        const room = MAX_PENDING_ASSET_FILES - files.length;

        if (room <= 0 || incoming.length > room) {
            toast.error(`You can add up to ${MAX_PENDING_ASSET_FILES} files.`);
        }

        const created = incoming
            .slice(0, Math.max(0, room))
            .map(createPendingAssetFile);
        const next = [...files, ...created];
        setFiles(next);

        return next;
    }

    function removeFile(key: string): void {
        setFiles((current) => {
            const removed = current.find((item) => item.key === key);

            if (removed) {
                revokePendingAssetFiles([removed]);
            }

            return current.filter((item) => item.key !== key);
        });
    }

    return { files, addFiles, removeFile };
}
