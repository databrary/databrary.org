import { Exclude } from 'class-transformer';
import * as crypto from 'crypto';

export class UserDTO {
    @Exclude()
    authServerId: string;

    @Exclude()
    emailPrimary: string;

    @Exclude()
    avatarId: number;

    @Exclude()
    emails: string[];

    @Exclude()
    additionalName: string;

    @Exclude()
    familyName: string;

    @Exclude()
    givenName: string;

    @Exclude()
    displayFullName: string;

    @Exclude()
    bio: string;

    @Exclude()
    urls: string[];

    @Exclude()
    orcid: string;

    id: number;

    useGravatar: boolean;

    image: Object;

    gravatar: Object;

    constructor(user: Partial<UserDTO>) {
        Object.assign(this, user);

        if (!user.emails) this.emails = [this.emailPrimary];
        if (!user.displayFullName) this.displayFullName = `${this.givenName} ${this.familyName}`;
        if (!user.gravatar) this.gravatar = this.getGravatars();
    }

    private getGravatars () {
        return this.emailPrimary ? {
            'thumbnail': this.getGravatarURL(32),
            'large': this.getGravatarURL(400)
            } : null;
    }

    private getGravatarURL (size: number = 32) {
        const md5 = this.emailPrimary 
            ? crypto.createHash('md5').update(this.emailPrimary.toString()).digest('hex')
            : '';

        return `https://gravatar.com/avatar/${md5}?s=${size}&d=monsterid`;
    }
}