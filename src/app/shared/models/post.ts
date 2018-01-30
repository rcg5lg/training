export class Post {
    constructor(rawData: Object = {}) {
        this.id = rawData['id'] || 0;
        this.message = rawData['message'] || '';
        this.createdBy = rawData['createdBy'] || '';
        this.createdAt = rawData['createdAt'] || null;
        this.changedBy = rawData['changedBy'] || '';
        this.changedAt = rawData['changedAt'] || null;
    }

    id: number;
    message: string;
    createdBy: string;
    createdAt: Date;
    changedBy: string;
    changedAt: Date;

    clone(): Post {
        return new Post(JSON.parse(JSON.stringify(this)));
    }

}
