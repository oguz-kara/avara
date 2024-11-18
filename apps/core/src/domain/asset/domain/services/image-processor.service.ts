import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as sharp from 'sharp'
import { DefaultScreenSizeItem } from '../types/default-screen-size-item.type'

@Injectable()
export class ImageProcessor {
  constructor(private readonly configService: ConfigService) {}

  async getBufferMetadata(fileBuffer: Buffer): Promise<{
    mime_type: string
    width: number
    height: number
    file_size: number
  }> {
    const imageFormat = this.configService.get<string>('asset.imageExtension')
    const metadata = await sharp(fileBuffer).metadata()

    return {
      mime_type: imageFormat ? imageFormat : metadata.format,
      width: metadata.width,
      height: metadata.height,
      file_size: fileBuffer.length,
    }
  }

  async resizeImage(
    fileBuffer: Buffer,
    options: DefaultScreenSizeItem,
  ): Promise<Buffer> {
    const { height, mode, width } = options
    const imageFormat = this.configService.get<keyof sharp.FormatEnum>(
      'asset.imageExtension',
    )
    const h = height === 'auto' || !height ? null : height

    if (mode === 'crop') {
      if (imageFormat)
        return sharp(fileBuffer)
          .resize({
            width,
            height: h,
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy,
          })
          .toFormat(imageFormat)
          .toBuffer()

      return sharp(fileBuffer).resize(width, h).toBuffer()
    }

    if (mode === 'resize') {
      if (imageFormat)
        return sharp(fileBuffer)
          .resize({
            width,
            height: h,
            fit: sharp.fit.inside,
          })
          .toFormat(imageFormat)
          .toBuffer()

      return sharp(fileBuffer).resize(width, h).toBuffer()
    }
  }
}
