import { extract, createExtractFn } from '.';

describe(extract, () => {
  it('should mark frets to string content', () => {
    const [result, frets] = extract(
      `0123456789
0123456789
%%% ^  ^   %%%
%%% a  b   %%%`,
    );
    expect(result).toBe('0123456789\n0123456789');
    expect(frets.a.line).toBe(1);
    expect(frets.a.character).toBe(4);
    expect(frets.b.line).toBe(1);
    expect(frets.b.character).toBe(7);
  });
});

describe(createExtractFn, () => {
  it('should mark frets to string content with custom tags', () => {
    const extract = createExtractFn('/* %%', '%% */');
    // prettier-ignore
    const content = '0123456789    \n'
                  + '0123456789    \n'
                  + '/* %% ^  %% */\n'
                  + '/* %% a  %% */\n'
    const [, frets] = extract(content);
    expect(frets.a.line).toBe(1);
    expect(frets.a.character).toBe(6);
  });
});
