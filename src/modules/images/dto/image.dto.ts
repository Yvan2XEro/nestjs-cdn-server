import { ApiProperty } from "@nestjs/swagger";

export class ImageDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    image: any;
}


// export class UploadDto {
//     @ApiProperty({ type: 'string', format: 'binary' }) // Indiquez que le champ est un fichier binaire
//     file: Express.Multer.File;

// }
