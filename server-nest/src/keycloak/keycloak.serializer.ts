import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeycloakSerializer extends PassportSerializer {
  serializeUser(
    user: any, 
    done: (err: Error, user: any) => void
  ): any {
    done(null, user);
  }

  deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ): any {
    done(null, payload);
  }
}