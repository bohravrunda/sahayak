import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('emotion')
export class EmotionController {

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyze(@UploadedFile() file: Express.Multer.File) {

    // TEMP: just to verify file received
    return {
      message: 'File received successfully',
      filename: file.originalname,
      size: file.size,
    };
  }
}
