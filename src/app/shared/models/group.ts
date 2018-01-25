import { GroupMember } from './group-member';

export class Group {
    constructor(rawData: Object = {}) {
        this.id = rawData['id'] || 0;
        this.name = rawData['name'] || '';
        this.owner = rawData['owner'] || '';
        this.ownerName = rawData['ownerName'] || '';
        this.description = rawData['description'] || '';
        this.members = (rawData['members'] || []).map((rawMemberData: Object) => {
            return new GroupMember(rawMemberData);
        });
    }

    id: number;
    name: string;
    owner: number;
    ownerName: string;
    description: string;
    members: GroupMember[];

    public clone() {
        return new Group(JSON.parse(JSON.stringify(this)));
    }
}
