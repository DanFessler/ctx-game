import type { NativeApi } from "../../server/server.ts";

const native = new Proxy({} as NativeApi, {
  get:
    (_, method: string) =>
    (...args: unknown[]) =>
      fetch("http://localhost:3001/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, args }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.error) throw new Error(res.error);
          return res.result;
        }),
});

export default native;
