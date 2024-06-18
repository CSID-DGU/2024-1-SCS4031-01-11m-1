export class CountPerCategoryDto{
    categoryName:string;
    categoryId:string;
    previousWeekVocCount:number;
    currentWeekVocCount:number;

    constructor(
        categoryName:string,
        categoryId:string,
        previousWeekVocCount:number,
        currentWeekVocCount:number
    ){
        this.categoryName = categoryName;
        this.categoryId = categoryId
        this.previousWeekVocCount = previousWeekVocCount;
        this.currentWeekVocCount = currentWeekVocCount;
    }
}