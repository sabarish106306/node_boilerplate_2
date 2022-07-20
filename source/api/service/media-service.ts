import { response } from "express";
import { metaData } from "../../environment/meta-data";
import { Connectionservice } from "./connection-service";

export class MediaService {
  static postSingleImage(bodyContent: any, tables: any) {
    const {
      profileId,
      mediaId,
      momentId,
      mediaType,
      originalFileName,
      place,
      date,
    } = bodyContent;
    const db = Connectionservice.postgresConnection(metaData.db.database);
    return db.connect().then(async (client) => {
      try {
        return await client
          .query(
            `INSERT INTO ${tables.mediaDetails} (profile_id, media_id, moment_id, media_type, media_name, place, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING media_id as "mediaId"`,
            [
              profileId,
              mediaId,
              momentId,
              mediaType,
              originalFileName,
              place,
              date,
            ]
          )
          .catch((error) => {
            return error;
          })
          .then((data) => {
            return data.rows;
          })
          .finally(() => {
            client.release();
          });
      } catch (error) {
        return error;
      }
    });
  }
  static getMediaDetails(media_id: string, tables: any) {
    const db = Connectionservice.postgresConnection(metaData.db.database);
    return db.connect().then(async (client) => {
      try {
        return await client
          .query(
            `select profile_id, moment_id from ${tables.mediaDetails} where media_id = $1`,
            [media_id]
          )
          .then((mediaData) => {
            return mediaData.rows;
          })
          .catch((error) => {
            return error;
          })
          .finally(() => {
            client.release();
          });
      } catch (error) {
        client.release();
        response.status(500).send(metaData.message.serverError);
      }
    });
  }
}
