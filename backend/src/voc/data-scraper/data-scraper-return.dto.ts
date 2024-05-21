export class DataScraperReturnDto{
    private score:number;
    private description:string;
    private date:Date;

    constructor(score:number, description:string, date:Date){
        this.score = score;
        this.description = description;
        this.date = date;
    };

    public getScore():number{
        return this.score;
    }

    public getDescription():string{
        return this.description;
    }

    public getDate():Date{
        return this.date;
    }

}