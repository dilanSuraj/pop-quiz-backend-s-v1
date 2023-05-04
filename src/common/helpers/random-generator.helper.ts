import * as randomize from 'randomatic';
import { userConfig } from 'src/config/user-config';

export const generateStudentId = (): string => randomize('0', userConfig.idLength);

export const generateRandomNumberString = (length: number): string => randomize('0', length);

export const generateRandomLetters = (length: number): string => randomize('a', length);
