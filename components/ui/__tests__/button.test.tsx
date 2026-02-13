import { describe, it, expect } from 'vitest';

export const add = (a: number, b: number) => a + b;

describe('Simple Logic Test', () => {
    it('should pass', () => {
        expect(add(1, 1)).toBe(2);
    });
});
