import React, { useState } from 'react';
import './NFCTransfer.css';

const NFCTransfer: React.FC = () => {
  const [mode, setMode] = useState<'send' | 'receive' | null>(null);
  const [message, setMessage] = useState<string>('');
  const [receivedMessage, setReceivedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  const startNFCSend = async () => {
    try {
      setIsLoading(true);
      setStatus('Verificando soporte NFC...');
      
      console.log('NDEFReader disponible:', 'NDEFReader' in window);
      console.log('Objeto window:', window);
      
      if (!('NDEFReader' in window)) {
        setStatus('Tu navegador no soporta la API Web NFC. Asegúrate de:' + 
                 '\n1. Usar Chrome en Android' +
                 '\n2. Tener NFC activado' +
                 '\n3. Estar en una conexión segura (HTTPS)');
        return;
      }

      setStatus('Iniciando NFC...');
      const ndef = new (window as any).NDEFReader();
      
      setStatus('Solicitando permisos NFC...');
      await ndef.scan();

      setStatus('Intentando escribir mensaje...');
      await ndef.write({
        records: [{ 
          recordType: "text", 
          data: message,
          encoding: "utf-8",
          lang: "es"
        }]
      }).catch((error: any) => {
        console.error('Error en write:', error);
        throw error;
      });
      
      setStatus('¡Mensaje enviado correctamente!');
    } catch (error: any) {
      console.error('Error detallado:', error);
      if (error.name === 'NotAllowedError') {
        setStatus('Permiso denegado para usar NFC');
      } else if (error.name === 'NotSupportedError') {
        setStatus('NFC no está soportado o está desactivado en tu dispositivo');
      } else if (error.name === 'SecurityError') {
        setStatus('Error de seguridad. Asegúrate de estar usando HTTPS');
      } else {
        setStatus(`Error: ${error.name} - ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startNFCReceive = async () => {
    try {
      setIsLoading(true);
      setStatus('Esperando mensaje NFC...');
      
      if ('NDEFReader' in window) {
        const reader = new (window as any).NDEFReader();
        await reader.scan();
        
        reader.addEventListener("reading", ({ message }: any) => {
          const record = message.records[0];
          const textDecoder = new TextDecoder();
          setReceivedMessage(textDecoder.decode(record.data));
          setStatus('¡Mensaje recibido!');
          setIsLoading(false);
        });
      } else {
        setStatus('Tu dispositivo no soporta NFC');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error al recibir:', error);
      setStatus('Error al iniciar la recepción');
      setIsLoading(false);
    }
  };

  return (
    <div className="nfc-container">
      <h1>Transferencia NFC</h1>
      
      <div className="mode-buttons">
        <button 
          className={`mode-button ${mode === 'send' ? 'active' : ''}`}
          onClick={() => setMode('send')}
        >
          📤 Enviar
        </button>
        <button 
          className={`mode-button ${mode === 'receive' ? 'active' : ''}`}
          onClick={() => setMode('receive')}
        >
          📥 Recibir
        </button>
      </div>

      {mode === 'send' && (
        <div className="transfer-section">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje"
            rows={4}
          />
          <button 
            className="action-button"
            onClick={startNFCSend}
            disabled={isLoading || !message}
          >
            {isLoading ? 'Enviando...' : 'Enviar por NFC'}
          </button>
        </div>
      )}

      {mode === 'receive' && (
        <div className="transfer-section">
          <button 
            className="action-button"
            onClick={startNFCReceive}
            disabled={isLoading}
          >
            {isLoading ? 'Escaneando...' : 'Iniciar recepción'}
          </button>
          {receivedMessage && (
            <div className="message-box">
              <h3>Mensaje recibido:</h3>
              <p>{receivedMessage}</p>
            </div>
          )}
        </div>
      )}

      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default NFCTransfer; 