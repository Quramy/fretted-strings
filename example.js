import assert from 'node:assert';

// import { mark } from 'fretted-strings';
import { mark } from './dist/index.js';

const frets = {};
const content = mark(
  `
      hogehoge
  %%% ^      ^   %%%
  %%% p1     p2  %%%
      fooo`,
  frets,
);

// Function `mark` returns a string which is removed lines enclosed by '%%%' tags from the parameter.
assert.equal(
  content,
  `
      hogehoge
      fooo`,
);

// And this function assigns specified location whose name is represented
// as identifier under the `^` character to 2nd parameter.
assert.equal(frets.p1.pos, 7);
assert.equal(frets.p1.line, 1);
assert.equal(frets.p1.character, 6);

assert.equal(frets.p2.pos, 14);
assert.equal(frets.p2.line, 1);
assert.equal(frets.p2.character, 13);
