const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadToS3(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        reject(err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(data.Location);
      }
    });
  });
}

const uploadFile = async (image, fileName, bucketName = "chatbot") => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: image,
  };

  try {
    const imageLoc = await uploadToS3(params);
    console.log("Image location:", imageLoc);
    return imageLoc;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

module.exports = {
  uploadFile,
};
