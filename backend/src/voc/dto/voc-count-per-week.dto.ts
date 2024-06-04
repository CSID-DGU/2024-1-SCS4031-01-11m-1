export class VocCountPerWeekDto{
    date:Date
    positive:number;
    negative:number;
    total:number;

    constructor(
        date:Date,
        positive:number,
        negative:number
    ){
        this.date = date;
        this.positive = positive;
        this.negative = negative;
        this.total = positive+negative;
    }

    public static create(date:Date, positive:number, negative:number):VocCountPerWeekDto{
        return new VocCountPerWeekDto(date, positive, negative);
    }
}