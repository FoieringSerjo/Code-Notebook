import './preview.css';
import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  err: string;
}

//debug: Inject script into html file, may cause to problems with long code
// const html = `
//   <script>
//     ${code}
//   </script>
//   `;

//TODO: It's a workaround for preview window to not hover over the resizable bar.
//TODO: <style> html { background-color: white; }</style>
const html = `
<html>
  <head>
    <style> html { background-color: white; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
    const handleError = (err) => {
      const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
        console.log(err);
    };
    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });

    window.addEventListener('message', (event) => {
      try {
        eval(event.data);
      } catch (err) {
        handleError(err);
      }
    }, false)
    </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe title="preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
