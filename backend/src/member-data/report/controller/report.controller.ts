import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReportService } from '../service/report.service';
import { AuthGuard } from '@nestjs/passport';
import { MemberEntity } from 'src/auth/member.entity';
import { Member } from 'src/auth/get-member-decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportEntiy } from '../entity/report.entity';

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
    const { productId, minuteId } = createReportDto;
    return await this.reportService.createReport(productId, member.memberId, minuteId)
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
  async laodReport(@Param('reportId') reportId): Promise<ReportEntiy>{
    return await this.reportService.loadReport(reportId);
  };
}