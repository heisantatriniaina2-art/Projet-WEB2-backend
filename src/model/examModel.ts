export interface Exam {
    id: number;
    title: string;
    description: string;
    startsAt: Date;
    endsAt: Date;
    courseId: number;
    createdAt?: Date;
}
