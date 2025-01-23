const AWS = require('aws-sdk');
const s3 = new AWS.S3({ 
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const uploadFileOnS3 = async(file)=>{
    try {
      const params = {
        Bucket: 'recruitmentplatform',
        Key: `${Date.now()}-${file.originalname}`, // Generate a unique key
        Body: file.buffer
      };
  
      const result = await s3.upload(params).promise();
      return result.Location; 
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

export default uploadFileOnS3
