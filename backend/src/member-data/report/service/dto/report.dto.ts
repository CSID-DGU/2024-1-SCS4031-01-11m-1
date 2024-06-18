import { MemberEntity } from "src/auth/member.entity";
import { ReportSource } from "../../domain/report-source";
import {CountPerCategoryDto} from "./count-per-category.dto";
import { ReportEntity } from "../../entity/report.entity";

export class ReportDto{
    id: string;

    reportSources: ReportSource[];

    productName: string;

    member: MemberEntity;

    createdAt:Date;

    updatedAt:Date;

    vocCount:CountPerCategoryDto[];

    constructor(
        id:string,
        reportSources: ReportSource[],
        productName: string,
        member: MemberEntity,
        createdAt:Date,
        updatedAt:Date,
        vocCount:CountPerCategoryDto[]
    ){
        this.id = id;
        this.reportSources = reportSources;
        this.productName = productName;
        this.member = member;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.vocCount = vocCount;
    }

    public static createFromEntity(report:ReportEntity, vocCount:CountPerCategoryDto[]):ReportDto{
        return new ReportDto(report.id, report.reportSources, report.productName, report.member, report.createdAt, report.updatedAt, vocCount);
    }
}