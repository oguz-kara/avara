import { FileTypeService } from './services/file-type.service'
import { FilenameNormalizer } from './services/filename-normalizer.service'
import { ImageProcessor } from './services/image-processor.service'

export const DomainServices = [FilenameNormalizer, ImageProcessor, FileTypeService]
