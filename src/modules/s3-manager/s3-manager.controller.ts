import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { S3ManagerService } from './s3-manager.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from '../../common/interfaces/file.interface';
import { ApiTags } from '@nestjs/swagger';
import { deleteObject } from './dto/deleteObject.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../auth/types/roles.enum';
@ApiTags('aws-s3')
@Controller('s3')
export class S3ManagerController {
  constructor(private readonly s3: S3ManagerService) { }

  @Roles(Role.Admin)
  @Get('buckets')
  async getBuckets(): Promise<any> {
    return await this.s3.listBuckets();
  }

  @Roles(Role.Admin)
  @Get('buckets/:bucketName')
  async getObjectsByBucket(
    @Param('bucketName') bucketName: string,
  ): Promise<any> {
    return await this.s3.listObjects(bucketName);
  }

  @Roles(Role.Admin)
  @Post('buckets/:bucketName')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('bucketName') bucketName: string,
    @UploadedFile() file: File,
  ): Promise<any> {
    return await this.s3.uploadFile(bucketName, file);
  }

  @Roles(Role.Admin)
  @Delete('buckets/:bucketName')
  async deleteObject(
    @Param('bucketName') bucketName: string,
    @Body() body: deleteObject,
  ) {
    return await this.s3.deleteFile(bucketName, body.key);
  }
}
