import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Req, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from './multer.interface';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ImageDto } from './dto/image.dto';
import { multerOptions } from '../../utils/multer.config';
import { Request } from 'express'

@Controller('images')
@ApiTags('Images')

export class ImagesController {
  constructor() { }

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImageDto,
  })
  @ApiCreatedResponse({ description: 'Image uploaded successfully' })
  @ApiBadRequestResponse({ description: 'Bad request' })

  async create(@UploadedFile() file: MulterFile, @Req() request: Request) {
    if (!file) {
      throw new BadRequestException('No image uploaded.');
    }
    const serverUrl = `${request.protocol}://${request.get('host')}`;

    const imageUrl = `${serverUrl}/${file.path.split("public/")[1]}`;
    return { imageUrl }
  }
}
