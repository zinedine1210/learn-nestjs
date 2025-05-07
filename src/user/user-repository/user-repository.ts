import { Connection } from '../connection/connection';

export class UserRepository {
    connection: Connection

    save() {
        console.info(`save user repository with connection ${this.connection.getName()}`);
    }
}

export function createUserRepository(connection: Connection): UserRepository {
    const createNew = new UserRepository();
    createNew.connection = connection;
    return createNew;
}