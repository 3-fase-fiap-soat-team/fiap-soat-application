export class Customer {
    constructor(
        public readonly id: string,
        private _name: string,
        private _email: string,
        private _cpf: string,
        private _createdAt: Date,
        private _updatedAt: Date,
    ) {

    }
    
    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get cpf(): string {
        return this._cpf;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateName(newName: string): void {
        this._name = newName;
        this.touch();
    }

    updateEmail(newEmail: string): void {
    this._email = newEmail;
    this.touch();
    }

    updateCpf(newCpf: string): void {
    this._cpf = newCpf;
    this.touch();
    }
    
    private touch(): void {
        this._updatedAt = new Date();
    }
}