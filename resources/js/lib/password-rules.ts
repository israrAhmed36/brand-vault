export type PasswordRuleKey = 'minLength' | 'uppercase' | 'number' | 'special';

export type PasswordRuleResult = {
    key: PasswordRuleKey;
    label: string;
    passed: boolean;
};

export type PasswordValidationState = {
    rules: PasswordRuleResult[];
    isPasswordValid: boolean;
    isConfirmationValid: boolean;
    showConfirmationError: boolean;
};

const PASSWORD_RULE_DEFINITIONS: Array<{
    key: PasswordRuleKey;
    label: string;
    test: (password: string) => boolean;
}> = [
    {
        key: 'minLength',
        label: 'At least 8 characters',
        test: (password) => password.length >= 8,
    },
    {
        key: 'uppercase',
        label: 'At least 1 uppercase letter',
        test: (password) => /[A-Z]/.test(password),
    },
    {
        key: 'number',
        label: 'At least 1 number',
        test: (password) => /\d/.test(password),
    },
    {
        key: 'special',
        label: 'At least 1 special character',
        test: (password) => /[^A-Za-z0-9]/.test(password),
    },
];

export function evaluatePasswordRules(password: string): PasswordRuleResult[] {
    return PASSWORD_RULE_DEFINITIONS.map((rule) => ({
        key: rule.key,
        label: rule.label,
        passed: rule.test(password),
    }));
}

export function getPasswordValidationState(
    password: string,
    passwordConfirmation: string,
): PasswordValidationState {
    const rules = evaluatePasswordRules(password);
    const isPasswordValid = rules.every((rule) => rule.passed);
    const hasStartedConfirmation = passwordConfirmation.length > 0;
    const isConfirmationValid =
        hasStartedConfirmation && password === passwordConfirmation;

    return {
        rules,
        isPasswordValid,
        isConfirmationValid,
        showConfirmationError:
            hasStartedConfirmation && password !== passwordConfirmation,
    };
}
