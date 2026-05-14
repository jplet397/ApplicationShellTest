import { describe, it, expect } from 'vitest';
import { MicroFrontends } from '../MicroFrontends';

describe('MicroFrontends enum', () => {
  it('defines Mfe1', () => {
    expect(MicroFrontends.Mfe1).toBeDefined();
  });

  it('defines Mfe2', () => {
    expect(MicroFrontends.Mfe2).toBeDefined();
  });

  it('defines Mfe3', () => {
    expect(MicroFrontends.Mfe3).toBeDefined();
  });

  it('all values are distinct', () => {
    const values = [MicroFrontends.Mfe1, MicroFrontends.Mfe2, MicroFrontends.Mfe3];
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});
