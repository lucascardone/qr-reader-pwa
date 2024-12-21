import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>QR Code Scanner</h1>
      <div style={{ width: '300px', margin: '0 auto' }}>
        <QrReader
          onResult={(result, error) => {
            if (result?.text) {
              setData(result.text);
            }
            if (error) {
              console.error(error);
            }
          }}
          style={{ width: '100%' }} // Aquí está corregido
        />
      </div>
      <p>{data ? `Scanned Data: ${data}` : 'No data scanned yet.'}</p>
    </div>
  );
};

export default QRCodeScanner;
