import { location2pos } from './position-converter';

function getCols(line: string, pre = 0): number[] {
  const idx = line.indexOf('^');
  if (idx === -1) {
    return [];
  }
  return [idx + pre, ...getCols(line.slice(idx + 1), pre + idx + 1)];
}

export type Fret = {
  line: number;
  character: number;
  pos: number;
};

export type Frets<TKey extends string = string> = Record<TKey, Fret>;

type SplitByWS<TContent extends string, TAcc extends string[] = []> = TContent extends ` ${infer TRest}`
  ? SplitByWS<TRest, TAcc>
  : TContent extends `${infer TRest} `
    ? SplitByWS<TRest, TAcc>
    : TContent extends `${infer THead} ${infer TRest}`
      ? SplitByWS<TRest, THead extends '^' ? TAcc : [...TAcc, THead]>
      : TContent extends '^'
        ? TAcc
        : [...TAcc, TContent];

type ExtractKeys<
  TLine extends string,
  TTagStart extends string,
  TTagEnd extends string,
> = TLine extends ` ${infer TRest}`
  ? ExtractKeys<TRest, TTagStart, TTagEnd>
  : TLine extends `${infer TRest} `
    ? ExtractKeys<TRest, TTagStart, TTagEnd>
    : TLine extends `${TTagStart} ${infer TBody} ${TTagEnd}`
      ? SplitByWS<TBody>
      : [];

type ToLines<
  TContent extends string,
  TTagStart extends string,
  TTagEnd extends string,
  TAcc extends string[] = [],
> = TContent extends `${infer THead}\n${infer TRest}`
  ? ToLines<TRest, TTagStart, TTagEnd, [...TAcc, ...ExtractKeys<THead, TTagStart, TTagEnd>]>
  : TContent extends `\n${infer TRest}`
    ? ToLines<TRest, TTagStart, TTagEnd, TAcc>
    : TContent extends `${infer TRest}\n`
      ? ToLines<TRest, TTagStart, TTagEnd, TAcc>
      : [...TAcc, ...ExtractKeys<TContent, TTagStart, TTagEnd>];

type FretsKeys<TContent extends string, TTagStart extends string, TTagEnd extends string> = string extends TContent
  ? string
  : string extends TTagStart
    ? string
    : string extends TTagEnd
      ? string
      : ToLines<TContent, TTagStart, TTagEnd>[number];

const DEFAULT_TAG_START = '%%%';
const DEFAULT_TAG_END = '%%%';

export function createExtractFn<TTagStart extends string, TTagEnd extends string>(
  tagStart: TTagStart,
  tagEnd: TTagEnd,
) {
  const extract = <TContent extends string>(content: TContent) => {
    const lines = content.split('\n');
    const actualLines = [] as string[];
    const markInfos = [] as { col: number; line: number; name: string }[];
    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed.startsWith(tagStart) || !trimmed.endsWith(tagEnd)) {
        actualLines.push(line);
        continue;
      }
      const cols = getCols(line);
      ++i;
      if (!lines[i]) break;
      const trimmedNameLine = lines[i].trim();
      if (!trimmedNameLine.startsWith(tagStart) || !trimmedNameLine.endsWith(tagEnd)) {
        continue;
      }
      const names = trimmedNameLine
        .slice(tagStart.length, trimmedNameLine.length - tagEnd.length)
        .replace('\\', ' ')
        .trim()
        .split(/\s+/);
      for (let j = 0; j < Math.min(cols.length, names.length); ++j) {
        markInfos.push({
          line: actualLines.length - 1,
          col: cols[j],
          name: names[j],
        });
      }
    }
    const actualContent = actualLines.join('\n');
    const markers = markInfos.reduce(
      (acc, { name, line, col: character }) => {
        return {
          ...acc,
          [name]: {
            line,
            character,
            pos: location2pos(actualContent, { line, character }),
          },
        };
      },
      {} as Frets<FretsKeys<TContent, TTagStart, TTagEnd>>,
    );
    markers;
    return [actualContent, markers] as const;
  };

  return extract;
}

export const extract = createExtractFn(DEFAULT_TAG_START, DEFAULT_TAG_END);

export default extract;
