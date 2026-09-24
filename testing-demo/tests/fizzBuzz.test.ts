import { fizzBuzz } from '../src/fizzBuzz';
import { describe, it, expect } from '@jest/globals';

describe('fizzBuzz', () => {
  it.each([undefined, null, '1', true, {}, []])(
    'should throw if input is not a number (%p)',
    (input) => {
      expect(() => fizzBuzz(input)).toThrow('Input should be a number.');
    }
  );

  it.each([15, 30, 45])('should return FizzBuzz if input is divisible by 3 and 5 (%i)', (input) => {
    expect(fizzBuzz(input)).toBe('FizzBuzz');
  });

  it.each([3, 6, 9])('should return Fizz if input is divisible by 3 only (%i)', (input) => {
    expect(fizzBuzz(input)).toBe('Fizz');
  });

  it.each([5, 10, 20])('should return Buzz if input is divisible by 5 only (%i)', (input) => {
    expect(fizzBuzz(input)).toBe('Buzz');
  });

  it.each([1, 2, 7, 11])('should return the input if it is not divisible by 3 or 5 (%i)', (input) => {
    expect(fizzBuzz(input)).toBe(input);
  });
});