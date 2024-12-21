import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner: React.FC = () => {
  const scannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scannerRef.current) {
      const html5QrCodeScanner = new Html5QrcodeScanner(
        scannerRef.current.id, // ID del elemento HTML
        { fps: 10, qrbox: 250 }, // Configuración del escáner
        false // Verbose: deshabilitado
      );

      html5QrCodeScanner.render(
        (decodedText) => {
          alert(`QR Code scanned: ${decodedText}`);
        },
        (errorMessage) => {
          console.error(errorMessage);
        }
      );

      // Devuelve una función sincrónica para limpiar el escáner
      return () => {
        html5QrCodeScanner.clear().catch((err) => {
          console.error("Error clearing scanner:", err);
        });
      };
    }
  }, []);

  return <div id="reader" ref={scannerRef}></div>;
};

export default QRCodeScanner;
