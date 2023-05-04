export const getModifiedTextSearchQuery = (q: string): string => {
    const words = q
        .split(' ')
        .map((word) => word.replace(/^[\+\-><~]+/g, '').replace(/[\+\-><~]+$/g, ''))
        .map((word) => word.replace(/[\*@"]+/g, ''))
        .filter((word: string) => !!word);
    return words.length > 0 ? words.join(' ') + '*' : '';
};
