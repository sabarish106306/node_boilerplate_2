import { Request, Response, NextFunction } from "express";
import { metaData } from "../../environment/meta-data";
import { MediaService } from "../service/media-service";
import { LogController } from "./log-controller";
import { AWSService } from "../service/aws-image-service";
import sharp from "sharp";
import util from "util";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
export class MediaController {
  static unLinkFile = util.promisify(fs.unlink);
  static bucketUrl = metaData.aws.s3.bucketUrl;
  static tables = metaData.db.tables;
  /**
   * postSingleImage
   * @param request
   * @param response
   */
  static postSingleImage(request: Request, response: Response) {
    try {
      const bodyContent = request.body;
      const img: any = request.file;
      const media_id = uuidv4();
      const { profileId, momentId } = bodyContent;
      let imageArray: any = [];
      let imageObject: any = {};
      const fileType = img?.mimetype.split("/")[1];
      bodyContent.mediaType = img?.mimetype.split("/")[0];
      bodyContent.originalFileName = img?.originalname;
      const s3FileName = `${media_id}.${fileType}`;
      bodyContent.mediaId = s3FileName;
      imageObject.key = `p-${profileId}/m-${momentId}/media/high-res/${s3FileName}`;
      imageObject.res = "high-res";
      imageObject.source = `${img?.path}`;
      imageObject.unlinkPath = `${img?.path}`;
      imageArray.push(imageObject);
      if (bodyContent.mediaType === "image") {
        const lowResImagePath = `./source/uploads/low-res/${momentId}.${fileType}`;
        sharp(img?.path)
          .resize(640, 480, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFile(lowResImagePath, async (err, data) => {
            if (err) {
              response.status(400).send({
                auth: false,
                message: metaData.message.media.compressionError,
                data: {},
              });
            } else {
              if (data) {
                imageObject = {};
                imageObject.key = `p-${profileId}/m-${momentId}/media/low-res/${s3FileName}`;
                imageObject.res = "low-res";
                imageObject.unlinkPath = lowResImagePath;
                imageObject.source =
                  data.size < img?.size ? lowResImagePath : img?.path;
                imageArray.push(imageObject);
              }
              Promise.all(
                imageArray.map(async (image: any) => {
                  const result = await AWSService.imageUpload(
                    MediaController.bucketUrl,
                    image.key,
                    image.source
                  );
                  return result;
                })
              )
                .then((s3UploadData) => {
                  if (s3UploadData) {
                    MediaService.postSingleImage(
                      bodyContent,
                      MediaController.tables
                    )
                      .then((mediaInsertedData) => {
                        if (mediaInsertedData) {
                          response.status(200).send({
                            auth: true,
                            message: metaData.message.media.mediaInsertSuccess,
                            data: {
                              isInserted: true,
                              mediaInsertedData,
                            },
                          });
                        } else {
                          response
                            .status(500)
                            .send(metaData.message.media.uploadError);
                        }
                      })
                      .catch((error) => {
                        LogController.writeLog(
                          "Exception in Media Service - post Single Image ",
                          error
                        );
                        response.status(500).send(metaData.message.serverError);
                      });
                    imageArray.map((image: any) => {
                      MediaController.unLinkFile(image?.unlinkPath);
                    });
                  }
                })
                .catch((error) => {
                  LogController.writeLog(
                    "Exception in Media Service - AWS imageUpload ",
                    error
                  );
                  response.status(500).send(metaData.message.media.uploadError);
                });
            }
          });
      } else {
        response.status(400).send({
          auth: false,
          message: metaData.message.media.onlyImageIsSupported,
          data: {},
        });
      }
    } catch (error) {
      LogController.writeLog(
        "Exception in Media Controller - post Single Image ",
        error
      );
      response.status(500).send(metaData.message.serverError);
    }
  }
  /**
   * getS3Image Method
   * @param request
   * @param response
   */
  static getS3Image(request: Request, response: Response) {
    const id: string = request.params.mediaId;
    try {
      MediaService.getMediaDetails(id, MediaController.tables)
        .then((mediaData) => {
          const mediaValues = mediaData[0];
          const key = `p-${mediaValues.profile_id}/m-${mediaValues.moment_id}/media/low-res/${id}`;
          const readStream = AWSService.getFileStream(
            key,
            MediaController.bucketUrl
          );
          if (readStream) {
            readStream
              .createReadStream()
              .on("error", (error) => {
                if (error.name === "NoSuchKey") {
                  response
                    .status(404)
                    .send({ mesage: metaData.message.media.mediaNotFound });
                }
              })
              .pipe(response);
          } else {
            response
              .status(500)
              .send({ message: metaData.message.serverError });
          }
        })
        .catch((error) => {
          LogController.writeLog(
            "Exception in Media Service - getS3 Image ",
            error
          );
          response.status(500).send({ message: metaData.message.serverError });
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in Media Controller - getS3 Image ",
        error
      );
      response.status(500).send({ message: metaData.message.serverError });
    }
  }
  /**
   * getS3HighresImage Method
   * @param request
   * @param response
   */
  static getS3HighResImage(request: Request, response: Response) {
    const id: string = request.params.mediaId;
    try {
      MediaService.getMediaDetails(id, MediaController.tables)
        .then((mediaData) => {
          const mediaValues = mediaData[0];
          const key = `p-${mediaValues.profile_id}/m-${mediaValues.moment_id}/media/high-res/${id}`;
          const readStream = AWSService.getFileStream(
            key,
            MediaController.bucketUrl
          );
          if (readStream) {
            readStream
              .createReadStream()
              .on("error", (error) => {
                if (error.name === "NoSuchKey") {
                  response
                    .status(404)
                    .send({ mesage: metaData.message.media.mediaNotFound });
                }
              })
              // .on("data", (data) => {})
              // .on("end", () => {})
              .pipe(response);
          } else {
            response
              .status(500)
              .send({ message: metaData.message.serverError });
          }
        })
        .catch((error) => {
          LogController.writeLog(
            "Exception in Media Service - getS3 Image ",
            error
          );
          response.status(500).send({ message: metaData.message.serverError });
        });
    } catch (error) {
      LogController.writeLog(
        "Exception in Media Controller - getS3 Highres Image ",
        error
      );
      response.status(500).send({ message: metaData.message.serverError });
    }
  }
}
