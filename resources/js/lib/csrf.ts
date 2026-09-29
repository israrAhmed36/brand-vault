export function getXsrfToken(): string {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='));

    if (!match) {
        return '';
    }

    return decodeURIComponent(match.slice('XSRF-TOKEN='.length));
}
