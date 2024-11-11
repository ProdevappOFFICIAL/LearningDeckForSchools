import React, { useState, ChangeEvent } from 'react';

interface ImageResizerProps {
  src: string;
}

const ImageResizer: React.FC<ImageResizerProps> = ({ src }) => {
  const [size, setSize] = useState<number>(100); // initial size

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(e.target.value, 10));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <img 
        src={src} 
        alt="Resizable" 
        width={size} 
        height={size} 
        style={{ transition: 'width 0.3s, height 0.3s' }}
      />
      <div>
        <label>Size: {size}px</label>
        <input 
          type="range" 
          min="50" 
          max="500" 
          value={size} 
          onChange={handleSizeChange} 
        />
      </div>
    </div>
  );
};

export default ImageResizer;