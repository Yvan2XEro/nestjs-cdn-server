import { ApiProperty } from "@nestjs/swagger";

export class ImportExcelDTO {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
