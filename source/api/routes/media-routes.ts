import express from "express";
import multer from "multer";
import { MediaController } from "../controller/media-controller";
const upload = multer({ dest: "./source/uploads/" });
const mediaRoutes = express.Router();

/**
 * @swagger
 * /api/media/image/:
 *   post:
 *     tags:
 *       - Media
 *     summary:
 *        upload images to s3 bucket
 *     description: Returns a id if media is uploaded
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "formData"
 *         name: "profileId"
 *         description: "profileId"
 *         type: string
 *         required: true
 *       - in: "formData"
 *         name: "momentId"
 *         description: "momentId"
 *         type: string
 *         required: true
 *       - in: "formData"
 *         name: "place"
 *         description: "place"
 *         type: string
 *         required: true
 *       - in: "formData"
 *         name: "date"
 *         description: "date"
 *         type: string
 *         format: date
 *         required: true
 *       - in: "formData"
 *         name: "file"
 *         description: "file"
 *         type: file
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a JSON object if media uploaded
 *         schema:
 *           type: object
 *           properties:
 *              auth:
 *                  type: boolean
 *              message:
 *                  type: string
 *              data:
 *                  type: object
 *                  properties:
 *                      isInserted:
 *                          type: boolean
 *                      mediaInsertedData:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                              id:
 *                                type: number
 *                              mediaId:
 *                                type: string
 *       500:
 *         description: Returns 500 for server exception
 *         schema:
 *           type: object
 *           properties:
 *              statusCode:
 *                  type: number
 *                  example: 500
 *              error:
 *                  type: string
 *              message:
 *                  type: string
 */
mediaRoutes.post(
  "/image/",
  upload.single("file"),
  MediaController.postSingleImage
);

/**
 * @swagger
 * /api/media/{mediaId}:
 *   get:
 *     tags:
 *       - Media
 *     summary:
 *        get low resolution image
 *     description: Returns a image if media is found
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/octet-stream
 *     parameters:
 *       - in: "path"
 *         name: "mediaId"
 *         description: "Required"
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a image stream if mediaId is found
 *         headers:
 *          content-type:
 *            application/octet-stream,
 *            image/jpeg
 *         content:
 *           image/*:
 *            schema:
 *              image:
 *                type: string
 *       404:
 *         description: Returns 404 for media not found
 *         schema:
 *           type: object
 *           properties:
 *              statusCode:
 *                  type: number
 *                  example: 404
 *              error:
 *                  type: string
 *              message:
 *                  type: string
 */
mediaRoutes.get("/:mediaId", MediaController.getS3Image);
/**
 * @swagger
 * /api/media/high-res/{mediaId}:
 *   get:
 *     tags:
 *       - Media
 *     summary:
 *        get high resolution image
 *     description: Returns a image if media is found
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/octet-stream
 *     parameters:
 *       - in: "path"
 *         name: "mediaId"
 *         description: "Required"
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a image stream if mediaId is found
 *         headers:
 *          content-type:
 *            application/octet-stream,
 *            image/jpeg
 *         content:
 *           image/*:
 *            schema:
 *              image:
 *                type: string
 *       404:
 *         description: Returns 404 for media not found
 *         schema:
 *           type: object
 *           properties:
 *              statusCode:
 *                  type: number
 *                  example: 404
 *              error:
 *                  type: string
 *              message:
 *                  type: string
 */
mediaRoutes.get("/high-res/:mediaId", MediaController.getS3HighResImage);

export default mediaRoutes;
