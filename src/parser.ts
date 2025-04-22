import { VideoEntity } from "./video_entity";
const { inflate } = require("./pako");
const { ProtoMovieEntity } = require("./proto");

declare const swan: any;

export class Parser {
  load(url: string): Promise<VideoEntity> {
    return new Promise((resolver, rejector) => {
      if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
        swan.request({
          url: url,
          responseType: "arraybuffer",
          success: (res: any) => {
            try {
              const inflatedData = inflate(res.data as ArrayBuffer);
              const movieData = ProtoMovieEntity.decode(inflatedData);
              resolver(new VideoEntity(movieData));
            } catch (error: any) {
              rejector(error);
            }
          },
          fail: (error: any) => {
            rejector(error);
          },
        });
      } else {
        swan.getFileSystemManager().readFile({
          filePath: url,
          success: (res: any) => {
            try {
              const inflatedData = inflate(res.data as ArrayBuffer);
              const movieData = ProtoMovieEntity.decode(inflatedData);
              resolver(new VideoEntity(movieData));
            } catch (error: any) {
              rejector(error);
            }
          },
          fail: (error: any) => {
            rejector(error);
          },
        });
      }
    });
  }
}
