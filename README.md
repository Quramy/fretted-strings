# fretted-strings

[![npm version](https://badge.fury.io/js/fretted-strings.svg)](https://badge.fury.io/js/fretted-strings)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Quramy/fretted-strings/master/LICENSE.txt)

Marks on your strings and get it's position.

```sh
npm i fretted-strings
```

## Basic usage

```ts
import assert from 'node:assert';
import { extract } from 'fretted-strings';

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
```

## Use custom tag

```ts
import { createExtractFn } from 'fretted-strings';

const extract = createExtractFn('<!--%%', '%%-->');

const [content, frets] = extract(
  `
    <html>
      <div>hogehoge</div>
      <!--%%   ^    %%-->
      <!--%%   p    %%-->
    </html>
  `,
);
```

## LICENSE

MIT
