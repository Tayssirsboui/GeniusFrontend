export class Comment {
    id!: number;
    userId!: number;
    likes!: number;
    description!: string;
    imageUrl!: string; 
    createdBy!: string;
    createdAt!: Date;
    postId!: number;
 }