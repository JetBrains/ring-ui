export const isArray = (arg: unknown): arg is readonly unknown[] => Array.isArray(arg);
export const isTruthy = <T>(arg: T | false | '' | 0 | null | undefined): arg is T => Boolean(arg);
