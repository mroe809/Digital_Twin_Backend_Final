import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import aws from 'aws-sdk';
import asyncHandler from "express-async-handler";

const s3 = new aws.S3({
    accessKeyId: "accessKeyId" || '',
    secretAccessKey: "secretAccessKey" || '',
    region: "eu-central-1" || '',
  });


  const createFolders = (async (req: Request, res: Response) => {
    const processId = `${req.body.processId}/`; // Hauptordnerpfad im Bucket
    const folderNames = ['Vorbereitung', '3D-Druck', 'Nachbearbeitung', 'Versand'];
    
    // Erstelle den Hauptordner
    await s3.putObject({
        Bucket: 'digitaltwinbucket-ur', // Bucketname
        Key: processId,
        ACL: 'public-read', // Zugriffskontrollliste
        Body: '' // Leerer Body, da kein Inhalt erforderlich ist
    }).promise();

    // Erstelle Unterordner im Hauptordner
    const createFolderPromises = folderNames.map(folder => {
        const subFolderKey = `${processId}${folder}/`; // Pfad des Unterordners
        return s3.putObject({
            Bucket: 'digitaltwinbucket-ur', // Bucketname
            Key: subFolderKey,
            ACL: 'public-read', // Zugriffskontrollliste
            Body: '' // Leerer Body, da kein Inhalt erforderlich ist
        }).promise();
    });

    // Warte auf das Abschließen aller Promise-Objekte
    await Promise.all(createFolderPromises);

    return res.status(200).json({ message: 'Ordner erfolgreich angelegt!' });
});


export { createFolders };