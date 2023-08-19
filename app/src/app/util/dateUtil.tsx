export const getDateString = (date: Date): string => {
    /**
     * Return the string in the form "YYYY-MM-DD" for a date object.
     */
    return date.toISOString().split('T')[0];
};

export const getLastSundayFromDate = (date: Date): string => {
    /**
     * Return the date string of the most recently passed or current Sunday.
     */
    const dayOfWeek = date.getDay();
    date.setDate(date.getDate() - dayOfWeek);
    date.setHours(0, 0, 0, 0);
    return getDateString(date);
};

export const getLastSundayFromString = (date: string): string => {
    /**
     * Return the date string of the most recently passed or current Sunday.
     */
    const dateRepr = new Date(date);
    return getLastSundayFromDate(dateRepr);
};

export const subtractWeeksFromDate = (date: Date, n: number): string => {
    /**
     * Return the date string of the date subtracted by n weeks from the given date object.
     */
    date.setDate(date.getDate() - 7 * n);
    return getDateString(date);
};

export const subtractWeeksFromString = (date: string, n: number): string => {
    /**
     * Return the date string of the date subtracted by n weeks from the given date string.
     */
    const dateRepr = new Date(date);
    return subtractWeeksFromDate(dateRepr, n);
};

export const addDaysToDateString = (date: string, n: number): string => {
    /**
     * Add one day to the given date string and return the updated string.
     */
    const dateRepr = new Date(date);
    dateRepr.setDate(dateRepr.getDate() + n);
    return getDateString(dateRepr);
};
