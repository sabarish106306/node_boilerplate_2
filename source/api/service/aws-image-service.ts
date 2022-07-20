import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import { metaData } from "../../environment/meta-data";
export class AWSService {
  static s3 = new S3({
    accessKeyId: metaData.aws.s3.accessKey,
    secretAccessKey: metaData.aws.s3.secretAccessKey,
    region: metaData.aws.s3.region,
    maxRetries: 3,
  });
  static imageUpload(bucket: any, key: any, path: any) {
    const imageBody = fs.createReadStream(path);
    const params = {
      Bucket: bucket,
      Key: key,
      Body: imageBody,
    };
    const options = {
      partSize: 5 * 1024 * 1024,
      queuseSize: 5,
    };
    return AWSService.s3
      .upload(params, options, (err: any, data: any) => {
        if (err) return err;
        return data;
      })
      .promise();
  }
  static getFileStream(key: string, bucketUrl: any) {
    const params = {
      Key: key,
      Bucket: bucketUrl,
    };
    return AWSService.s3.getObject(params);
  }
}
