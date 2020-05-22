import { Injectable } from '@nestjs/common';
import { GqlClientService } from 'src/gqlClient/gqlClient.service';

import { isEmpty } from 'lodash';

@Injectable()
export class FileService {
    private readonly GQL_FOLDER = `${process.cwd()}/../gql`

    constructor(
        private readonly client: GqlClientService 
    ) {}

    async insertFile(fileName: string, id: number, assetId: number, fileFormat: string) {
        const path = `${this.GQL_FOLDER}/gql/insertFile.gql`;

        const { returning: users } = await this.client.adminMutate(
            path,
            {
                name: decodeURIComponent(fileName),
                uploadedById: id,
                assetId: assetId,
                fileFormatId: fileFormat
            }
        )

        return isEmpty(users) ? null : users[0];
    }
}
