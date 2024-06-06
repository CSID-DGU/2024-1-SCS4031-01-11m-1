import { ReportEntity } from "../../entity/report.entity";
import { ReportListDto } from "../dto/report-list.dto";

export class ReportMapper{
  static reportEntityToReportListDto(reportEntiy: ReportEntity): ReportListDto{
    const reportListDto = ReportListDto.createNew(reportEntiy.id, reportEntiy.productName, reportEntiy.createdAt, reportEntiy.updatedAt)
    return reportListDto;
  }
}