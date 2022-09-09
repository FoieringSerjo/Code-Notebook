import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

//debug: exporting anonymous function harder to debug
let service: esbuild.Service;
const bundle = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
      // wasmURL: '/esbuild.wasm',
    });
  }

  const result = await service.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    define: {
      //* Option to define without JSON.stringify these with '"production"'.
      'process.env.NODE_ENV': JSON.stringify('production'),
      global: 'window',
    },
  });

  return result.outputFiles[0].text;
};

export default bundle;
