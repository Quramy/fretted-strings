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
import { mark } from 'fretted-strings';

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
```

## Use custom tag

```ts
import { mark } from 'fretted-strings';

setOptions({
  tagStart: '<!--%%',
  tagEnd: '%%-->',
});

const frets = {};

mark(
  `
    <html>
      <div>hogehoge</div>
      <!--%%   ^    %%-->
      <!--%%   p    %%-->
    </html>
  `,
  frets,
);
```

Or

```ts
import { mark } from 'fretted-strings';

const marker = new FretsMarker({
  tagStart: '<!--%%',
  tagEnd: '%%-->',
});

const frets = {};

marker.mark(
  `
    <html>
      <div>hogehoge</div>
      <!--%%   ^    %%-->
      <!--%%   p    %%-->
    </html>
  `,
  frets,
);
```

## LICENSE

MIT
