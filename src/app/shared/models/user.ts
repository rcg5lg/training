export class User {
    constructor(id = 0, username = '', token = '', name = '', email = '', description = '', avatarUrl = '', age = 0,
        currentProject = '', agency = '') {
        this.id = id;
        this.username = username;
        this.token = token;
        this.name = name;
        this.email = email;
        this.description = description;
        this.avatarUrl = avatarUrl;
        this.age = age;
        this.currentProject = currentProject;
        this.agency = agency;
    }

    id: number;
    username: string;
    token: string;
    name: string;
    email: string;
    description: string;
    avatarUrl: string;
    age: number;
    currentProject: string;
    agency: String;
}
