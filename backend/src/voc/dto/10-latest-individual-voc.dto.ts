import { SentimentEnum } from "../entity/sentiment.enum";
import { VocEntity } from "../entity/voc.entity";

export class TenLatestIndividualDto{
    description:string;
    uploadedDate:string;
    primarySentiment:SentimentEnum;
    vocId:string;
    vocAnalysisId:string;

    constructor(
        description:string,
        uploadedDate:string,
        primarySentiment:SentimentEnum,
        vocId:string,
        vocAnalysisId:string
    ){
        this.description = description;
        this.uploadedDate = uploadedDate;
        this.primarySentiment = primarySentiment;
        this.vocId = vocId;
        this.vocAnalysisId = vocAnalysisId
    }

    public static createFromEntity(vocEntity:VocEntity):TenLatestIndividualDto{
        return new TenLatestIndividualDto(vocEntity.description,
            vocEntity.uploadedDate.toLocaleDateString(),
            vocEntity.vocAnalysis.primarySentiment,
            vocEntity.id,
            vocEntity.vocAnalysis.id);
    }
}