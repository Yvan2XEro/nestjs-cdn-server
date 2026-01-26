import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
    dest: "./public/images",
};

const defaultAllowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

const normalizeExtension = (value: string): string => value.replace(/^\./, '').trim().toLowerCase();

const parseAllowedExtensions = (): string[] => {
    const raw = process.env.ALLOWED_EXTENSIONS;
    if (!raw) {
        return defaultAllowedExtensions;
    }
    const list = String(raw)
        .split(',')
        .map(normalizeExtension)
        .filter(Boolean);
    return list.length > 0 ? list : defaultAllowedExtensions;
};

const getMimeSubtype = (mimetype: string | undefined): string => {
    if (!mimetype) {
        return '';
    }
    const parts = mimetype.split('/');
    if (parts.length < 2) {
        return '';
    }
    return parts[parts.length - 1].split('+')[0].toLowerCase();
};

// Multer upload options
export const multerOptions = {
    // Enable file size limits
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        const allowedExtensions = parseAllowedExtensions();
        const fileExtension = normalizeExtension(extname(file.originalname));
        const mimeSubtype = getMimeSubtype(file.mimetype);
        if (allowedExtensions.includes(fileExtension) || allowedExtensions.includes(mimeSubtype)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            const uploadPath = multerConfig.dest;
            // Create folder if doesn't exist
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            const sanitizedOriginal = file.originalname.replace(/\s+/g, '_');
            cb(null, `${randomName}-${sanitizedOriginal}`);
        },
    }),
};
