import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('storage.uploadDir', './uploads');
    this.maxFileSize = this.configService.get<number>('storage.maxFileSize', 10485760); // 10MB
    
    const allowedTypes = this.configService.get<string>(
      'storage.allowedFileTypes',
      'image/jpeg,image/png,image/jpg,application/pdf'
    );
    this.allowedMimeTypes = allowedTypes.split(',');

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<{ filename: string; path: string; url: string }> {
    // Validate file
    this.validateFile(file);

    // SECURITY FIX: Generate safe filename to prevent path traversal
    const safeFilename = this.generateSafeFilename(file.originalname);
    const filePath = path.join(this.uploadDir, safeFilename);

    // SECURITY FIX: Validate final path is within upload directory
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(this.uploadDir);
    
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      throw new BadRequestException('Invalid file path detected');
    }

    try {
      // Write file
      await fs.promises.writeFile(filePath, file.buffer);

      this.logger.log(`File saved: ${safeFilename}`);

      return {
        filename: safeFilename,
        path: filePath,
        url: `/uploads/${safeFilename}`,
      };
    } catch (error) {
      this.logger.error(`Failed to save file: ${error.message}`);
      throw new BadRequestException('Failed to save file');
    }
  }

  async deleteFile(filename: string): Promise<void> {
    // SECURITY FIX: Sanitize filename
    const safeFilename = path.basename(filename);
    const filePath = path.join(this.uploadDir, safeFilename);

    // SECURITY FIX: Validate path
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(this.uploadDir);
    
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      throw new BadRequestException('Invalid file path');
    }

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        this.logger.log(`File deleted: ${safeFilename}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async getFile(filename: string): Promise<Buffer> {
    // SECURITY FIX: Sanitize filename
    const safeFilename = path.basename(filename);
    const filePath = path.join(this.uploadDir, safeFilename);

    // SECURITY FIX: Validate path
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(this.uploadDir);
    
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      throw new BadRequestException('Invalid file path');
    }

    try {
      return await fs.promises.readFile(filePath);
    } catch (error) {
      this.logger.error(`Failed to read file: ${error.message}`);
      throw new BadRequestException('File not found');
    }
  }

  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Check mime type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }
  }

  /**
   * SECURITY FIX: Generate safe filename
   * - Remove path traversal characters (../, .\, etc)
   * - Generate UUID prefix
   * - Keep original extension
   * - Sanitize special characters
   */
  private generateSafeFilename(originalName: string): string {
    // Get file extension
    const ext = path.extname(originalName).toLowerCase();
    
    // Validate extension (no double extensions like .php.jpg)
    if (ext.includes('.', 1)) {
      throw new BadRequestException('Invalid file extension');
    }

    // Generate UUID prefix
    const uuid = uuidv4();

    // Sanitize base name (remove everything except alphanumeric, dash, underscore)
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .substring(0, 50); // Limit length

    return `${uuid}-${baseName}${ext}`;
  }
}
