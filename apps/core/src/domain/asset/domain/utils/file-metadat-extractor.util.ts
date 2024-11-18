import * as mime from 'mime-types'

export class FileMetadataExtractor {
  static extractMetadata(
    fileBuffer: Buffer,
    fileName: string,
  ): {
    mime_type: string
    file_size: number
  } {
    const mimeType = mime.lookup(fileName) || 'application/octet-stream'

    return {
      mime_type: mimeType,
      file_size: fileBuffer.length,
    }
  }
}
