import React from "react";
import S3 from "react-aws-s3";
window.Buffer = window.Buffer || require("buffer").Buffer;

export const Upload =()=> {
  const fileInput = React.useRef();

  const config = {
    bucketName: 'not-twitter',
    // dirName: process.env.REACT_APP_DIR_NAME /* optional */,
    region: 'us-east-1',
    accessKeyId: `${process.env.REACT_APP_AWS_ACCESSKEY_ID}`,
    secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESSKEY}`,
  };

  const handleClick = (event) => {
    event.preventDefault();
    let newArr = fileInput.current.files;
    for (let i = 0; i < newArr.length; i++) {
      handleUpload(newArr[i]);
    }
  };

  const handleUpload = (file) => {
    let newFileName = file.name.replace(/\..+$/, "");
    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(file, newFileName).then((data) => {
      if (data.status === 204) {
        console.log("success");
      } else {
        console.log("fail");
      }
    });
  };

  return (
    <>
      <form className='upload-steps' onSubmit={handleClick}>
        <label>
          Upload file:
          <input type='file' multiple ref={fileInput} />
        </label>
        <br />
        <button type='submit'>Upload</button>
      </form>
    </>
  );
}
