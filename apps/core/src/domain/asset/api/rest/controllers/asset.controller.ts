import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Delete,
  Param,
  Get,
  Query,
  Body,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { RequestContext } from '@avara/core/application/context/request-context'
import { AssetService } from '@avara/core/domain/asset/application/services/asset.service'
import { Ctx } from '@avara/core/application/context/request-context.decorator'

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAsset(
    @UploadedFile() file: Express.Multer.File,
    @Ctx() ctx: RequestContext,
  ) {
    return await this.assetService.uploadAsset(ctx, file)
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Ctx() ctx: RequestContext,
  ) {
    return await this.assetService.uploadMultipleAssets(ctx, files)
  }

  @Delete('delete-all')
  async deleteAll(@Ctx() ctx: RequestContext) {
    await this.assetService.deleteAll(ctx)

    return { message: 'All assets deleted' }
  }

  @Delete('multiple')
  deleteFiles(@Ctx() ctx: RequestContext, @Body() body: { ids: string[] }) {
    const ids = body.ids

    console.log(body)

    return this.assetService.deleteManyAsset(ctx, ids)
  }

  @Delete(':id')
  deleteFile(@Ctx() ctx: RequestContext, @Param('id') id: string) {
    return this.assetService.deleteAsset(ctx, id)
  }

  @Get('multiple')
  async getList(
    @Ctx() ctx: RequestContext,
    @Query() query: { limit?: number; position?: number },
  ) {
    const { limit, position } = query

    return await this.assetService.findMany(ctx, {
      limit,
      position,
    })
  }

  @Get(':id')
  async getOneById(@Ctx() ctx: RequestContext, @Param('id') id: string) {
    return await this.assetService.findById(ctx, id)
  }
}
