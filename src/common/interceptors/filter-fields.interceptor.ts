import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class FilterFieldsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        const excludeStatus = !!request.query?.excludes;

        let param: any;
        if (request.query?.fields !== undefined) {
            param = request.query?.fields;
            delete request.query?.fields;
            delete request.query?.excludes;
        } else if (request.query?.excludes !== undefined) {
            param = request.query?.excludes;
            delete request.query?.excludes;
            delete request.query?.fields;
        }

        const fields = param
            ? param.split(',').filter((field: any) => !!field && typeof field === 'string' && !!field.trim())
            : [];

        if (fields.length > 0) {
            return next.handle().pipe(
                map((data) => {
                    if (data && typeof data === 'object') {
                        const lodashFields = fields
                            .filter((field: any) => !field.includes('[].'))
                            .map((field: any) => field.trim());
                        const customFields = fields
                            .filter((field: any) => field.includes('[].'))
                            .map((field: any) => field.trim());

                        let lodashFilteredData = {};
                        if (excludeStatus) {
                            lodashFilteredData = lodashFields.length > 0 ? _.omit(data, lodashFields) : {};
                        } else {
                            lodashFilteredData = lodashFields.length > 0 ? _.pick(data, lodashFields) : {};
                        }

                        const excludesFields: string[] = [];
                        if (excludeStatus) {
                            customFields.forEach((field: string) => {
                                excludesFields.push(
                                    field.split('[].').length === 2 ? field.split('[].')[1] : undefined,
                                );
                            });
                        }

                        let customFilteredData = {};
                        customFields.forEach((field: string) => {
                            const fieldName = field.split('[].').length === 2 ? field.split('[].')[0] : undefined;
                            const subField = field.split('[].').length === 2 ? field.split('[].')[1] : undefined;

                            if (fieldName && subField && data[fieldName] && data[fieldName].constructor === Array) {
                                const filteredArrayField = data[fieldName].map((arrayElement: any) => {
                                    if (!!arrayElement && typeof arrayElement === 'object') {
                                        if (excludeStatus) {
                                            return _.omit(arrayElement, excludesFields);
                                        } else {
                                            return _.pick(arrayElement, subField);
                                        }
                                    }
                                    return arrayElement;
                                });
                                customFilteredData = _.merge(customFilteredData, { [fieldName]: filteredArrayField });
                            }
                        });
                        return _.merge(lodashFilteredData, customFilteredData);
                    } else {
                        return data;
                    }
                }),
            );
        } else {
            return next.handle();
        }
    }
}
