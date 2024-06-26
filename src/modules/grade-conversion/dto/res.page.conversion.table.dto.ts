import { ApiProperty } from '@nestjs/swagger';
import { ResGradeConversionTableDto } from './res.conversion-table.dto';
import { PaginationDto } from '../../../shared/dto/pagination/pagination.dto';

export class PaginationConversionTableDto extends PaginationDto {
  @ApiProperty({
    isArray: true,
    type: ResGradeConversionTableDto,
  })
  items: ResGradeConversionTableDto[];

  constructor(items, meta, links) {
    super(meta, links);
    this.items = items;
  }
}
