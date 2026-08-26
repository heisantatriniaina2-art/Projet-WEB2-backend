export interface Exam {
    id : number;
    title : string;
    startsAt : Date;
    endsAt : Date;
    courseId : number;
    createdAt?: Date;
}
