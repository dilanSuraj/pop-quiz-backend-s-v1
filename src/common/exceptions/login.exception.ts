import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginException extends HttpException {
    constructor(message?: string) {
        super(
            {
                statusCode: HttpStatus.FORBIDDEN,
                errorCode: 'unauthorised_login',
                message: message || 'Please_contact_support',
                error: 'Bad Request',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
