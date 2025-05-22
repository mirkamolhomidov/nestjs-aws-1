import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectAclCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as generateUuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
@Injectable()
export class s3Service {
  private readonly s3Client: S3Client;
  private readonly bucketname: string;
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_S3_ACCESS_KEY_ID',
        ) as string,
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
    this.bucketname = this.configService.get<string>(
      'AWS_S3_BUCKET_NAME',
    ) as string;
  }
  async uploadFile(file: Express.Multer.File, prefix: string) {
    try {
      const fileName = `${prefix}/${generateUuid()}`
      const commond = new PutObjectCommand({
        Bucket: this.bucketname,
        Body: file.buffer,
        Key: fileName,
        ContentType: file.mimetype,
      });
      const response = await this.s3Client.send(commond)
      if (response.$metadata.httpStatusCode === 200) {
        const getUrlcommond = new GetObjectCommand({
          Bucket: this.bucketname,
          Key: fileName,
          // ResponseContentDisposition: 'attachment',
        })
        const url = await getSignedUrl(this.s3Client, getUrlcommond)
        return url
      }
    } catch (error) {
      throw new HttpException(error,error.$metadata.httpStatusCode)
    }
  }
}
