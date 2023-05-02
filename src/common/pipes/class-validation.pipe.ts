import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ClassValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            const failedConstraints = this.getConstraintFromValidationErrors(errors);
            const keys = failedConstraints ? Object.keys(failedConstraints) : [];
            throw new BadRequestException(keys.length > 0 ? failedConstraints[keys[0]] : 'Validation failed');
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private getConstraintFromValidationErrors(errors: ValidationError[]): {
        [type: string]: string;
    } | null {
        // only goes deep for 3 levels, if needs more use recursion
        for (const error of errors) {
            if (error.constraints) {
                return error.constraints;
            } else if (error.children) {
                for (const child of error.children) {
                    if (child.constraints) {
                        return child.constraints;
                    } else if (child.children) {
                        for (const grandChild of child.children) {
                            if (grandChild.constraints) {
                                return grandChild.constraints;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
}
