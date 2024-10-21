function compose<A, R1, R2, R3, R4, R5, R6, R7>(
  f7: (a: R6) => R7,
  f6: (a: R5) => R6,
  f5: (a: R4) => R5,
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (a: A) => R1,
): (a: A) => R7;
function compose<A, R1, R2, R3, R4, R5, R6>(
  f6: (a: R5) => R6,
  f5: (a: R4) => R5,
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (a: A) => R1,
): (a: A) => R6;
function compose<A, R1, R2, R3, R4, R5>(
  f5: (a: R4) => R5,
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (a: A) => R1,
): (a: A) => R5;
function compose<A, R1, R2, R3, R4>(
  f4: (a: R3) => R4,
  f3: (a: R2) => R3,
  f2: (a: R1) => R2,
  f1: (a: A) => R1,
): (a: A) => R4;
function compose<A, R1, R2, R3>(f3: (a: R2) => R3, f2: (a: R1) => R2, f1: (a: A) => R1): (a: A) => R3;
function compose<A, R1, R2>(f2: (a: R1) => R2, f1: (a: A) => R1): (a: A) => R2;
function compose<A>(...funcs: Array<(a: A) => A>): (a: A) => A {
  return funcs.reduce(
    (acc, func) => arg => acc(func(arg)),
    arg => arg,
  );
}

export default compose;
