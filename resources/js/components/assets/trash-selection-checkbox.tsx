import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { TrashGroupCheckboxState } from '@/lib/trash-selection-state';

type TrashSelectionCheckboxProps = {
    id?: string;
    checked: TrashGroupCheckboxState;
    onCheckedChange: (selected: boolean) => void;
    ariaLabel: string;
    className?: string;
};

export function TrashSelectionCheckbox({
    id,
    checked,
    onCheckedChange,
    ariaLabel,
    className,
}: TrashSelectionCheckboxProps) {
    return (
        <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={(value) => onCheckedChange(value === true)}
            aria-label={ariaLabel}
            className={cn('size-4 shrink-0', className)}
        />
    );
}
