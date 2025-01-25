import { AWS_BUCKET } from "@utils/variables";
import { S3 } from "aws-sdk";
import fs from "fs";

// Create an instance of S3
const s3 = new S3();

// Helper function to upload and delete files from S3
export const uploadToS3 = async (
  file: any,
  folder: string,
  existingUrl?: string
) => {
  // Read the file content
  const fileContent = fs.readFileSync(file.filepath);

  // If there's an existing file in S3, delete it
  if (existingUrl) {
    const existingKey = existingUrl.split(".amazonaws.com/")[1]; // Extract the S3 key from URL
    try {
      await s3
        .deleteObject({
          Bucket: AWS_BUCKET as string,
          Key: existingKey,
        })
        .promise();
      console.log("Existing file deleted successfully.");
    } catch (error) {
      console.warn("Error deleting existing file:", error);
    }
  }

  // Create a unique S3 key for the file (e.g., profiles/12345-image.jpg)
  const fileName = `${folder}/${Date.now()}-${file.originalFilename}`;

  // Upload to S3
  const params = {
    Bucket: AWS_BUCKET as string,
    Key: fileName, // File path in S3
    Body: fileContent,
    ContentType: file.mimetype || "application/octet-stream",
  };

  const result = await s3.upload(params).promise();

  return result; // Return the URL of the uploaded file
};

//Home work
const getBucketDocuments = async () => {};
