import { mark, FretsMarker, Frets } from ".";

describe(mark, () => {
  it('should mark frets to string content', () => {
    const frets: Frets ={};
    // prettier-ignore
    const content = '0123456789    \n'
                  + '0123456789    \n'
                  + '%%%^   ^   %%%\n'
                  + '%%%a   b   %%%';
    const result = mark(content, frets);
    expect(result).toBe('0123456789    \n0123456789    ');
    expect(frets.a.line).toBe(1);
    expect(frets.a.character).toBe(3);
    expect(frets.b.line).toBe(1);
    expect(frets.b.character).toBe(7);
  });
});

describe(FretsMarker, () => {
  it('should mark frets to string content', () => {
    const frets: Frets ={};
    // prettier-ignore
    const content = '0123456789    \n'
                  + '0123456789    \n'
                  + '%%%^   ^   %%%\n'
                  + '%%%a   b   %%%';
    const result = new FretsMarker().mark(content, frets);
    expect(result).toBe('0123456789    \n0123456789    ');
    expect(frets.a.line).toBe(1);
    expect(frets.a.character).toBe(3);
    expect(frets.b.line).toBe(1);
    expect(frets.b.character).toBe(7);
  });

  it('should mark frets to string content with custom tags', () => {
    const frets: Frets ={};
    // prettier-ignore
    const content = '0123456789    \n'
                  + '0123456789    \n'
                  + '/* %% ^  %% */\n'
                  + '/* %% a  %% */\n'
    const result = new FretsMarker({
      tagStart: '/* %%',
      tagEnd: '%% */',
    }).mark(content, frets);
    expect(frets.a.line).toBe(1);
    expect(frets.a.character).toBe(6);
  });
});
