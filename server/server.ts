import express from "express";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

const api = {
  saveFile: async (path: string, data: string) => fs.writeFileSync(path, data),
  readFile: async (path: string) => fs.readFileSync(path, "utf-8"),
  listDir: async (path: string) => {
    const result = fs.readdirSync(path, { withFileTypes: true });
    return result.map((item) => {
      const hasExtension = !item.isDirectory() && item.name.includes(".");
      let extension: string | undefined;
      let subExtension: string | undefined;
      let thumbnail: string | undefined;

      if (hasExtension) {
        const splitName = item.name.split(".");
        extension = splitName[splitName.length - 1];
        subExtension =
          splitName.length > 2 ? splitName[splitName.length - 2] : undefined;

        if (extension === "png") {
          thumbnail = fs.readFileSync(path + "/" + item.name, "base64");
        }
      }

      return {
        name: item.name,
        path: path + "/" + item.name,
        isDirectory: item.isDirectory(),
        updatedAt: fs.statSync(path + "/" + item.name).mtime.toISOString(),
        size: fs.statSync(path + "/" + item.name).size,
        extension: extension,
        subExtension: subExtension,
        thumbnail: thumbnail,
      };
    });
  },
  loadFile: async (path: string) => {
    return fs.readFileSync(path, "utf-8");
  },
  openFile: async (path: string) => {
    // open file in default program
    exec(`start ${path}`);
  },
};
export type NativeApi = typeof api;

app.post("/call", async (req, res) => {
  const { method, args }: { method: keyof NativeApi; args: unknown[] } =
    req.body;
  try {
    const result = await (api[method] as (...args: unknown[]) => unknown)(
      ...args
    );
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(3001, () =>
  console.log("Native API server running on http://localhost:3001")
);
