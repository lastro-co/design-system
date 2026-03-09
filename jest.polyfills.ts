import { ReadableStream, TransformStream } from "node:stream/web";
import { TextDecoder, TextEncoder } from "node:util";

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  ReadableStream,
  TransformStream,
  Request: globalThis.Request ?? class Request {},
  Response: globalThis.Response ?? class Response {},
  Headers: globalThis.Headers ?? class Headers {},
});
