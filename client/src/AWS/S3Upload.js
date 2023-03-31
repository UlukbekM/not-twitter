import AWS from 'aws-sdk';
import { useState } from 'react';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESSKEY,
  dirName: 'tweet', /* optional */
  region: 'us-east-1',
  signatureVersion: 'v4',
});

//https://dev.to/shadid12/how-to-upload-images-to-s3-in-a-react-application-4lm

export const S3Upload = () => {
  const s3 = new AWS.S3();
  const [file, setFile] = useState(null);

  const [item, setItem] = useState("")
  const [key, setKey] = useState("")

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  }

  const uploadToS3 = async () => {
    if (!file) {
      return;
    }
    const params = { 
      Bucket: process.env.REACT_APP_BUCKET_NAME + '/test', 
      Key: `${Date.now()}.${file.name}`, 
      Body: file 
    };
    const temp = await s3.upload(params).promise();
    setItem(temp.Location)
    setKey(temp.Key)
    console.log(temp);
  }

  const deleteS3Item = async () => {
    var params = { Bucket: process.env.REACT_APP_BUCKET_NAME, Key: key }
    s3.deleteObject(params, function(err, data) {
      // if(err) console.log(err)
      // else console.log(data)
    })

    // return new Promise((resolve, reject) => {
    //   try {
    //     var params = { Bucket: process.env.REACT_APP_BUCKET_NAME, Key: key };
    //     s3.deleteObject(params, function(err, data) {
    //         if (err) reject(err);
    //         // an error occurred
    //         else resolve(data); // successful response
    //     });
    //   } catch (e) {
    //       reject(e);
    //   }
  // }


  }
  
  return (
    <div style={{ marginTop: '150px' }}>
      <h1>Test Image Upload</h1>
      <input type="file" onChange={handleFileSelect} />
      {file && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={uploadToS3}>Upload</button>
        </div>
      )}

      {item && (
        <div>
          <button onClick={deleteS3Item}>delete</button>
          <img src={item}/>
        </div>
      )}
      {/* {imageUrl && (
        <div style={{ marginTop: '10px' }}>
          <img src={imageUrl} alt="uploaded" />
        </div>
      )} */}
    </div>
  );
}