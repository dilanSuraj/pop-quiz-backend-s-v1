export interface Student {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
}

export enum StudentStatus {
    ACTIVATED = 'ACTIVATED',
    DEACTIVATED = 'DEACTIVATED',
}
