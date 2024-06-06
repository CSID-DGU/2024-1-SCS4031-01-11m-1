import { ReportSource } from "../../domain/report-source";
import { ReportEntity } from "../../entity/report.entity";

export class LoadReportResponseDto{
    id: string;
    reportSources: ReportSource[];
    productName: string;
    createdAt:string;
    updatedAt:string;

    constructor(
        id:string,
        resportSources: ReportSource[],
        productName: string,
        createdAt:string,
        updatedAt:string
    ){
        this.id = id;
        this.reportSources = resportSources;
        this.productName = productName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static createFromEntity(report:ReportEntity):LoadReportResponseDto{
        return new LoadReportResponseDto(
            report.id,
            report.reportSources,
            report.productName,
            report.createdAt.toLocaleDateString(),
            report.updatedAt.toLocaleDateString());
    }
}