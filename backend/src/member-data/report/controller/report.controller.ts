import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../service/report.service';
import { AuthGuard } from '@nestjs/passport';
import { MemberEntity } from 'src/auth/member.entity';
import { Member } from 'src/auth/get-member-decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntity } from '../entity/report.entity';
import { ApiExceptionResponse } from 'src/utils/decorator/exception-response.decorater';
import { LoadReportResponseDto } from './dto/load-report-response.dto';
import { ReportDto } from '../service/dto/report.dto';

@ApiTags('Member Data -report- Controller')
@Controller('/member-data')
export class ReportController {
  constructor(
    private reportService: ReportService
  ){};

  @ApiOperation({ summary: 'VOC 분석 레포트를 생성합니다.' })
  @Post('/report/:memberId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @Member() member: MemberEntity
  ){
    const { productId, minuteId, startDate, endDate } = createReportDto;
    return await this.reportService.createReport(productId, member.memberId, minuteId, startDate, endDate);
  };

  @ApiOperation({ summary: '사용자의 VOC 분석 레포트를 불러옵니다.' })
  @Get('/reports/:memberId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async loadReports(
    @Member() member: MemberEntity
  ){
    return await this.reportService.loadReports(member.memberId);
  };

  @ApiOperation({ summary: 'reportId로 레포트를 불러옵니다.' })
  @ApiParam({
    name: 'reportId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Get('/report/:reportId')
  async laodReport(@Param('reportId') reportId): Promise<ReportDto>{
    return await this.reportService.loadReport(reportId);
  };

  @ApiOperation({ summary: 'voc 분석 레포트를 삭제합니다.' })
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 report id를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] voc 분석 레포트를 삭제하는 중 예상치 못한 에러가 발생했습니다.`,
  )
  @Delete('/delete-report/:reportId')
  @ApiParam({
    name: 'reportId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  async deleteReport(
    @Param('reportId') reportId
  ):Promise<void>{
    await this.reportService.deleteReport(reportId);
  };
}