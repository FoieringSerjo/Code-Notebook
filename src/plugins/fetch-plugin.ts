import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'fileCache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }
        // const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        // if (cachedResult) {
        //   return cachedResult;
        // }

        const { data, request } = await axios.get(args.path);
        //* responseURL include the path file name at the end.
        //TODO: resolve the path name included at the end, required the path without the file name at the end.

        const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';
        const contents =
          fileType === 'css'
            ? ` 
          const style = document.createElement('style'); 
          style.innerText = 'body { background-color: "green"}'; 
          document.head.appendChild(style)`
            : data;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        //* store response in cache indexedDB.
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
