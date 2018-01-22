import { GroupMember } from './group-member';

export class Group {
    id: number;
    name: string;
    owner: number;
    ownerToken: string;
    description: string;
    members: GroupMember[];
}
