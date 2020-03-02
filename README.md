# fretted-strings
Marks on your strings and get it's position.

```sh
npm i fretted-strings
```

## Basic usage

```ts
import { mark, Frets } from 'fretted-strings';

const frets: Frets = {};
const content = mark(`
      hogehoge
  %%% ^      ^   %%%
  %%% p1     p2  %%%
      fooo`, frets);

// Function `mark` returns a string which is removed lines enclosed by '%%%' tags from the parameter.
assert(content, `
      hogehoge
      fooo`);

// And this function assigns specified location whose name is represented
// as identifier under the `^` character to 2nd parameter.
assert(frets.p1.line, 1);
assert(frets.p1.col, 6);

assert(frets.p2.line, 1);
assert(frets.p2.col, 13);
```

## Use custom tag

```ts
import { setOptions, mark, Frets } from 'fretted-strings';

setOptions({
  tagStart: '<!--%%',
  tagEnd: '%%-->',
});

const frets: Frets = {};

mark(`<html>
  <div>hogehoge</div>
  <!--%%   ^    %%-->
  <!--%%   p    %%-->
</html>`, frets);
```

Or 

```ts
import { FretsMarker, Frets } from 'fretted-strings';

const marker = new FretsMarker({
  tagStart: '<!--%%',
  tagEnd: '%%-->',
});

const frets: Frets = {};

marker.mark(`<html>
  <div>hogehoge</div>
  <!--%%   ^    %%-->
  <!--%%   p    %%-->
</html>`, frets);
```

## LICENSE
MIT
