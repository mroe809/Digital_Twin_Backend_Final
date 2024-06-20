import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import express, { NextFunction, Request, Response } from 'express';


const app = express();

const s3Config = new S3Client({
    region: "eu-central-1" || process.env.APP_AWS_REGION || '',
    credentials:{
       accessKeyId: "accessKeyId" || process.env.APP_AWS_ACCESS_KEY || '',
       secretAccessKey: "secretAccessKey" || process.env.APP_AWS_SECRET_KEY || '',
   }
})


const upload = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: 'digitaltwinbucket-ur',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: Request, file, cb) {
            // Pfad mit Prozess-ID und Unterordner
            const processId = req.body.processId;
            const folderName = req.body.folderName;
            cb(null, `${processId}/${folderName}/${file.originalname}`);
        },
    }),
}).single('file');

const uploadFile = (req: Request, res: Response) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('Fehler beim Hochladen der Datei:', err);
            return res.status(500).json({ error: 'Fehler beim Hochladen der Datei' });
        }

        // Zugriff auf processId und folderName aus req.body
        const processId = req.body.processId;
        const folderName = req.body.folderName;
        console.log(`Process ID: ${processId}`);
        console.log(`Folder Name: ${folderName}`);

        // Zugriff auf die hochgeladene Datei aus req.file
        if (req.file) {
            console.log('Datei erfolgreich hochgeladen:', req.file);
        } else {
            console.error('Keine Datei hochgeladen');
        }

        return res.status(200).json({ message: 'Datei erfolgreich hochgeladen' });
    });
 };



    //  upload.single('file')(req, res, function (err) {
    //      if (err) {
    //          console.error('Fehler beim Hochladen der Datei:', err);
    //          return res.status(500).json({ error: 'Fehler beim Hochladen der Datei' });
    //      }
    //      console.log('Datei erfolgreich hochgeladen:', req.file);
    //      return res.status(200).json({ message: 'Datei erfolgreich hochgeladen' });
    //  });
  
 export {uploadFile};