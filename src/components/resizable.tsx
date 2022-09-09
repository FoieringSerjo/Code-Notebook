import './resizable.css';
import { ResizableBox } from 'react-resizable';
import React from 'react';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      minConstraints={[Infinity, 24]}
      maxConstraints={[Infinity, window.innerHeight * 0.9]}
      width={Infinity}
      height={300}
      resizeHandles={['s']}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;
