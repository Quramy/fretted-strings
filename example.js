import assert from 'node:assert';
// import { extract } from 'fretted-strings';
import { extract } from './dist/index.js';

const [content, frets] = extract(
  `
      hogehoge
  %%% ^      ^   %%%
  %%% p1     p2  %%%
      fooo`,
);

// The 1st value of the tuple is a string which is removed lines enclosed by '%%%' tags from the parameter.
assert.equal(
  content,
  `
      hogehoge
      fooo`,
);

// The 2nd value of the tuple is an object whose value represents location corresponding to "^" character.
// And names under "^" character are available to use as keys of the object.
assert.equal(frets.p1.pos, 7);
assert.equal(frets.p1.line, 1);
assert.equal(frets.p1.character, 6);

assert.equal(frets.p2.pos, 14);
assert.equal(frets.p2.line, 1);
assert.equal(frets.p2.character, 13);
