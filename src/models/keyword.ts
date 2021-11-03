interface Keyword {
  name: string;
  count: number;
}

interface Keywords {
  [keyword: string]: Keyword;
}

export { Keyword, Keywords };
