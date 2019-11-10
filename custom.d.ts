declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const value: object;
  export default value;
}

declare interface GlobalFetch {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
