import fs from 'fs';
import path from 'path';

const readCertificates = () => {
  let privateKey: string, certificate: string;

  try {
    privateKey = fs.readFileSync(
      path.join(__dirname, '../../cert/client-key.pem'),
      'utf8'
    );
    certificate = fs.readFileSync(
      path.join(__dirname, '../../cert/client-cert.pem'),
      'utf8'
    );
  } catch (error) {
    console.error('Error reading certificate files:', error);
    process.exit(1);
  }

  return { privateKey, certificate };
};

export default readCertificates;
