declare module '*.svg' {
  const content: any;
  export default content;
}

declare interface GlobalFetch {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}
