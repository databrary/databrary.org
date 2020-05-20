import { Injectable } from '@nestjs/common';
import { GqlClientService } from 'src/gqlClient/gqlClient.service';

import { isEmpty } from 'lodash';
import { UserDTO } from 'src/dtos/user.dto'

@Injectable()
export class UserService {
    private readonly GQL_FOLDER = `${process.cwd()}/../gql`

    constructor(private readonly client: GqlClientService) {}

    async findByEmail(emailPrimary: string) {
        const path = `${this.GQL_FOLDER}/getUserByEmail.gql`;

        const users = await this.client.adminQuery(
            path, 
            { emailPrimary }
        );

        return isEmpty(users) ? null : users[0];
    }

    async findByAuthId(authServerId: string){
        const path = `${this.GQL_FOLDER}/getUserByAuthId.gql`;

        const users = await this.client.adminQuery(
            path, 
            { authServerId }
        );

        return isEmpty(users) ? null : users[0];
    }

    async createUser ( user: UserDTO ) {
        const path = `${this.GQL_FOLDER}/registerUser.gql`;

        const { returning: users } = await this.client.adminMutate(
            path,
            user
        );

        return isEmpty(users) ? null : users[0];
    }
}
