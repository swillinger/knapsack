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

declare module 'data-urls' {
  const parseDataUrl: (
    dataUrl: string,
  ) => {
    mimeType: {
      /**
       * `image` in `image/png`
       */
      type: string;
      /**
       * `png` in `image/png`
       */
      subtype: string;
      toString: () => string;
      parameters: Map<string, string>;
    };
    body:
      | Uint8Array
      | {
          toString: () => string;
        };
  };
  export default parseDataUrl;
}
