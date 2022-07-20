import "dotenv/config";
import { Pool } from "pg";

export const metaData: any = {
  base: {
    apiPort: 8001,
  },
  db: {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    tables: {
      mediaDetails: "media_details",
    },
    connectionTimeOut: process.env.POSTGRES_TIMEOUT,
  },
  aws: {
    s3: {
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucketUrl: process.env.AWS_S3_BUCKET_URL,
      region: process.env.AWS_REGION,
    },
  },
  message: {
    serverError: "Server exception!",
    media: {
      mediaInsertSuccess: "media uploaded successfully",
      mediaInsertFailure: "can't able to upload the media file",
      onlyImageIsSupported: "only image is allowed",
      mediaNotFound: "media not found",
      compressionError: "error while resizing images",
      uploadError: "image upload error",
    },
  },
};
