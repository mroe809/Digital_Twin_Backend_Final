import { Request, Response } from 'express';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: "accessKeyId" || '',
  secretAccessKey: "secretAccessKey" || '',
  region: "eu-central-1" || '',
});

const getFiles = async (req: Request, res: Response) => {
    try {
      const { processId } = req.body; // Process ID from the request body

    if (!processId) {
      return res.status(400).json({ error: 'processId is required' });
    }
    const listParams = {
        Bucket: 'digitaltwinbucket-ur',
        Prefix: `${processId}/`, // Filter für den Hauptordner der jeweiligen Prozess-ID
    };

    const data = await s3.listObjectsV2(listParams).promise();

    const filesByFolder: { [key: string]: string[] } = {
      Vorbereitung: [],
      '3D-Druck': [],
      Nachbearbeitung: [],
      Versand: [],
    };

    if (data.Contents) {
      data.Contents.forEach((file) => {
        const key = file.Key || '';

        if (!key.endsWith('/')) {  
        if (key.includes(`${processId}/Vorbereitung/`)) {
          filesByFolder.Vorbereitung.push(key.replace(`${processId}/Vorbereitung/`, ''));
        } else if (key.includes(`${processId}/3D-Druck/`)) {
          filesByFolder['3D-Druck'].push(key.replace(`${processId}/3D-Druck/`, ''));
        } else if (key.includes(`${processId}/Nachbearbeitung/`)) {
          filesByFolder.Nachbearbeitung.push(key.replace(`${processId}/Nachbearbeitung/`, ''));
        } else if (key.includes(`${processId}/Versand/`)) {
          filesByFolder.Versand.push(key.replace(`${processId}/Versand/`, ''));
        }
      }
      });
    }

    res.status(200).json(filesByFolder);
  } catch (error) {
    console.error('Fehler beim Abrufen der Dateiliste:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Dateiliste' });
  }
};

const downloadFile = async (req: Request, res: Response) => {
  const { fileName } = req.body;

  try {
    const params = {
      Bucket: 'digitaltwinbucket-ur',
      Key: fileName,
    };

    const data = await s3.getObject(params).promise();

    res.attachment(fileName);
    res.send(data.Body);
  } catch (error) {
    console.error('Fehler beim Herunterladen der Datei:', error);
    res.status(500).json({ error: 'Fehler beim Herunterladen der Datei' });
  }
};

export { getFiles, downloadFile };