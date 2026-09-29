import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PasswordRequirementsProps } from '@/types/password';

export function PasswordRequirements({
    rules,
    hasStartedTyping,
}: PasswordRequirementsProps) {
    return (
        <ul
            className={cn(
                'space-y-1.5 text-xs',
                !hasStartedTyping && 'text-muted-foreground',
            )}
        >
            {rules.map((rule) => {
                const isActive = hasStartedTyping;
                const passed = isActive && rule.passed;

                return (
                    <li
                        key={rule.key}
                        className={cn(
                            'flex items-center gap-2',
                            isActive &&
                                (passed
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-destructive'),
                        )}
                    >
                        {passed ? (
                            <Check className="size-3.5 shrink-0" />
                        ) : (
                            <Circle
                                className={cn(
                                    'size-3 shrink-0',
                                    !isActive && 'opacity-50',
                                )}
                            />
                        )}
                        <span>{rule.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}
