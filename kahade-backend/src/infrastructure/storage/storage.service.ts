import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadPath: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_DEST', './uploads');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadPath}`);
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadPath, filename);

    fs.writeFileSync(filepath, file.buffer);
    
    this.logger.log(`File uploaded: ${filename}`);
    return `/uploads/${filename}`;
  }

  async delete(filename: string): Promise<void> {
    const filepath = path.join(this.uploadPath, filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      this.logger.log(`File deleted: ${filename}`);
    }
  }

  async get(filename: string): Promise<Buffer> {
    const filepath = path.join(this.uploadPath, filename);
    return fs.readFileSync(filepath);
  }
}
