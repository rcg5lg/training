export class User {
    constructor(rawData: Object = {}) {
        this.id = rawData['id'] || 0;
        this.username = rawData['username'] || '';
        this.token = rawData['token'] || '';
        this.email = rawData['email'] || '';
        this.description = rawData['description'] || '';
        this.avatarUrl = rawData['avatarUrl'] || '';
        this.age = rawData['age'] || 0;
        this.currentProject = rawData['currentProject'] || '';
        this.agency = rawData['agency'] || '';
    }

    id: number;
    username: string;
    token: string;
    email: string;
    description: string;
    avatarUrl: string;
    age: number;
    currentProject: string;
    agency: string;

    clone(): User {
        return new User(JSON.parse(JSON.stringify(this)));
    }

}
