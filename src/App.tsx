import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';

const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
      // wasmURL: '/esbuild.wasm',
    });
  };
  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        //* Option to define without JSON.stringify these with '"production"'.
        'process.env.NODE_ENV': JSON.stringify('production'),
        global: 'window',
      },
    });

    // console.log(result);
    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  //debug: Inject script into html file, may cause to problems with long code
  // const html = `
  //   <script>
  //     ${code}
  //   </script>
  //   `;

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (error) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
            throw error;
          }
          
        }, false)
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor initialValue="const a = 1;" onChange={(value) => setInput(value)} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe title="preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
    </div>
  );
};

export default App;
