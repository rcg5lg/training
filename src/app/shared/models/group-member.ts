export class GroupMember {
    constructor(rawData: Object = {}) {
        this.id = rawData['id'] || 0;
        this.name = rawData['name'] || '';
    }

    id: number;
    name: string;

    public clone() {
        return new GroupMember(JSON.parse(JSON.stringify(this)));
    }
}
