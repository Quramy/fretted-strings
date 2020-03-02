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

export type Frets = {
  [key: string]: Fret;
};

const DEFAULT_TAG_START = '%%%';
const DEFAULT_TAG_END = '%%%';

export type FretsMarkerOptions = {
  tagStart?: string;
  tagEnd?: string;
};

let defaultOpts = {
  tagStart: DEFAULT_TAG_START,
  tagEnd: DEFAULT_TAG_END,
};

export class FretsMarker {
  private _opt: { tagStart: string; tagEnd: string };
  constructor(options: FretsMarkerOptions = {}) {
    this._opt = {
      tagStart: DEFAULT_TAG_START,
      tagEnd: DEFAULT_TAG_END,
      ...options,
    };
  }

  mark(content: string, frets: Frets) {
    const lines = content.split('\n');
    const actualLines = [] as string[];
    const markInfos = [] as { col: number; line: number; name: string }[];
    for (let i = 0; i < lines.length; ++i) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed.startsWith(this._opt.tagStart) || !trimmed.endsWith(this._opt.tagEnd)) {
        actualLines.push(line);
        continue;
      }
      const cols = getCols(line);
      ++i;
      if (!lines[i]) break;
      const trimmedNameLine = lines[i].trim();
      if (!trimmedNameLine.startsWith(this._opt.tagStart) || !trimmedNameLine.endsWith(this._opt.tagEnd)) {
        continue;
      }
      const names = trimmedNameLine
        .slice(this._opt.tagStart.length, trimmedNameLine.length - this._opt.tagEnd.length)
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
    const markers = markInfos.reduce((acc, { name, line, col: character }) => {
      return {
        ...acc,
        [name]: {
          line,
          character,
          pos: location2pos(actualContent, { line, character }),
        },
      };
    }, {} as Frets);
    Object.assign(frets, markers);
    return actualContent;
  }
}

export function setOptions(options: FretsMarkerOptions) {
  defaultOpts = {
    ...defaultOpts,
    ...options,
  };
}

export function mark(content: string, frets: Frets) {
  return new FretsMarker(defaultOpts).mark(content, frets);
}

export default mark;
