import { Injectable } from '@nestjs/common';

import { GqlClientService } from 'src/gqlClient/gqlClient.service';
import { UserDTO } from 'src/dtos/user.dto';

import { isEmpty } from 'lodash';

@Injectable()
export class UserService {
    private readonly GQL_FOLDER = `${process.cwd()}/../gql`

    constructor(
        private readonly client: GqlClientService,
    ) {}

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

    // TODO(Reda): Move this to a new module
    async insertAvatarAsset(id: number) {
        const path = `${this.GQL_FOLDER}/insertAvatarAsset.gql`;
        const { returning: users} = await this.client.adminQuery(
            path,
            {
                userId: id,
                name: `Avatar ${id}`
            }
        );
    
        return isEmpty(users) ? null : users[0];
    }

    async updateUserAvatar(id: number, assetId: number, image?: object) {
        const path = `${this.GQL_FOLDER}/updateUserAvatar.gql`;

        const { returning: users } = await this.client.adminMutate(
            path, 
            {
                dbId: id,
                avatarId: assetId,
                image: image
            }
        );

        return isEmpty(users) ? null : users[0];
    }
}
