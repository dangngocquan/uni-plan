import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GroupCourseService } from './group-course.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageOptionGroupCourseDto } from './dto/req.page-option.group-course.dto';
import { PaginationGroupCourseDto } from './dto/res.page.group-course.dto';
import { ResGroupCourseDto } from './dto/res.group-course.dto';
import { ReqCreateGroupCourseDto } from './dto/req.create-group-course.dto';
import { UUID } from 'crypto';
import { ReqUpdateGroupCourseDto } from './dto/req.update-group-course.dto';
import { ResDeleteResultDto } from '../../shared/dto/response/res.delete-result.dto';
import { ResGroupRelationDto } from './dto/res.group-relation.dto';
import { ReqCreateGroupRelationDto } from './dto/req.create-group-relation.dto';
import { ResGroupCourseDetailDto } from './dto/res.group-course-detail.dto';

@Controller('group-course')
@ApiTags('group-course')
export class GroupCourseController {
  constructor(private readonly groupCourseService: GroupCourseService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get Group Course',
    type: PaginationGroupCourseDto,
  })
  async getGroups(
    @Query() dto: PageOptionGroupCourseDto,
  ): Promise<PaginationGroupCourseDto> {
    return this.groupCourseService.getGroups(dto);
  }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Create a new group course',
    type: ResGroupCourseDto,
  })
  async create(
    @Body() dto: ReqCreateGroupCourseDto,
  ): Promise<ResGroupCourseDto> {
    return this.groupCourseService.create(dto);
  }

  @Put(':groupId')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update a group course',
    type: ResGroupCourseDto,
  })
  async update(
    @Param('groupId', ParseUUIDPipe) groupId: UUID,
    @Body() dto: ReqUpdateGroupCourseDto,
  ): Promise<ResGroupCourseDto> {
    return this.groupCourseService.update(groupId, dto);
  }

  @Delete(':groupId')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete a group course',
    type: ResDeleteResultDto,
  })
  async delete(@Param('groupId', ParseUUIDPipe) groupId: UUID) {
    return this.groupCourseService.delete(groupId);
  }

  @Post('relation')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Create a new group relation',
    type: ResGroupRelationDto,
  })
  async addRelation(
    @Body() dto: ReqCreateGroupRelationDto,
  ): Promise<ResGroupRelationDto> {
    return this.groupCourseService.addRelation(dto);
  }

  @Get('details/:groupId')
  @ApiOkResponse({
    description: 'Get group course details',
    type: ResGroupCourseDetailDto,
  })
  async getGroupCourseDetails(
    @Param('groupId', ParseUUIDPipe) groupId: UUID,
  ): Promise<ResGroupCourseDetailDto> {
    return this.groupCourseService.getGroupDetails(groupId);
  }
}
