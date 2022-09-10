import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundle from '../bundler';
import Resizable from './resizable';

const CodeCell = () => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  // const onClick = async () => {
  //   const output = await bundle(input);
  //   setCode(output);
  // };

  //TODO: textarea not required anymore after code-editor integration.
  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor initialValue="const a = 1;" onChange={(value) => setInput(value)} />
          {/* <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea> */}
          {/* <div>
          <button onClick={onClick}>Submit</button>
        </div> */}
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
