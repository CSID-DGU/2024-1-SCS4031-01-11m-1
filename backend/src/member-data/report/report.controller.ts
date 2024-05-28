import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { AuthGuard } from '@nestjs/passport';
import { MemberEntity } from 'src/auth/member.entity';
import { Member } from 'src/auth/get-member-decorator';

@ApiTags('Member Data -report- Controller')
@Controller('/member-data')
export class ReportController {
  constructor(
    private reportService: ReportService
  ){};

  @ApiOperation({ summary: 'ragTest' })
  @Get('/ragTest/:memberId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  async ragTest(
    @Member() member: MemberEntity
  ){
    return await this.reportService.createReport('e3c33dc1-b5d2-48c8-a0d2-54c705b28d2b', member.memberId, '/Users/yun-yeongheon/11m/backend/uploads/files/áá¬áá´áá©á¨1716873401915.pdf' )
  }
}