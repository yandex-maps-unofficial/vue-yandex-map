/* eslint-disable no-unused-vars */

// https://github.com/microsoft/TypeScript/issues/32164

type FN = (...args: any[]) => unknown;

// current typescript version infers 'unknown[]' for any additional overloads
// we can filter them out to get the correct result
type _Params<T> = T extends {
  (...args: infer A1): unknown;
  (...args: infer A2): unknown;
  (...args: infer A3): unknown;
  (...args: infer A4): unknown;
  (...args: infer A5): unknown;
  (...args: infer A6): unknown;
  (...args: infer A7): unknown;
  (...args: infer A8): unknown;
  (...args: infer A9): unknown;
}
  ? [A1, A2, A3, A4, A5, A6, A7, A8, A9]
  : never;

// type T1 = filterUnknowns<[unknown[], string[]]>; // [string[]]
type filterUnknowns<T> = T extends [infer A, ...infer Rest]
  ? unknown[] extends A
    ? filterUnknowns<Rest>
    : [A, ...filterUnknowns<Rest>]
  : T;

// type T1 = TupleArrayUnion<[[], [string], [string, number]]>; // [] | [string] | [string, number]
type TupleArrayUnion<A extends readonly unknown[][]> = A extends (infer T)[]
  ? T extends unknown[]
    ? T
    : []
  : [];

export type OverloadParameters<T extends FN> = TupleArrayUnion<filterUnknowns<_Params<T>>>;
