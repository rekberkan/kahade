import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);

@Injectable()
export class StorageService {
  private readonly uploadDir = process.env.UPLOAD_DEST || './uploads';

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      await mkdirAsync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, subfolder?: string): Promise<string> {
    const targetDir = subfolder ? path.join(this.uploadDir, subfolder) : this.uploadDir;
    
    if (!fs.existsSync(targetDir)) {
      await mkdirAsync(targetDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(targetDir, filename);

    await writeFileAsync(filepath, file.buffer);

    return filepath;
  }

  async deleteFile(filepath: string): Promise<void> {
    if (fs.existsSync(filepath)) {
      await unlinkAsync(filepath);
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
}
