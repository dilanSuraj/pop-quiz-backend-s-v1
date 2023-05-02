import * as randomize from 'randomatic';
import { userConfig } from 'src/config/user-config';

export const generateRandomFilename = (): string => randomize('Aa', 10);

export const generateMulterFilename = (): string => randomize('Aa', 20);

export const generateRandomDirectoryName = (): string => randomize('Aa', 10);

export const generateUserId = (): string => randomize('0', userConfig.idLength);

export const generateRandomNumberString = (length: number): string => randomize('0', length);

export const generateRandomLetters = (length: number): string => randomize('a', length);

export const generateOrganizationId = (): string => 'ORG' + randomize('0', 15);

export const generateOrganizationTypeId = (): string => 'ORG_TYPE' + randomize('0', 15);

export const generateCountryId = (): string => 'C' + randomize('0', 15);

export const generateLocationId = (): string => 'L' + randomize('0', 15);

export const generateSourceId = (): string => 'SOURCE' + randomize('0', 15);

export const generateTargetOptionId = (): string => 'TARGET_OPTION' + randomize('0', 15);

export const generateTargetId = (): string => 'TARGET' + randomize('0', 15);

export const generateLanguageId = (): string => 'LNG' + randomize('0', 15);

export const generateResponseTypeId = (): string => 'RESPONSE' + randomize('0', 15);

export const generateIntensityId = (): string => 'INTENSITY' + randomize('0', 15);

export const generateCategoryId = (): string => 'CATEGORY' + randomize('0', 15);

export const generatePoliticalBiasId = (): string => 'PB' + randomize('0', 15);

export const generateSocialMediaPlatformId = (): string => 'SM' + randomize('0', 15);

export const generateSocialMediaPlatformContentId = (): string => 'SMC' + randomize('0', 15);

export const generateGenderReportCategoryId = (): string => 'GRC' + randomize('0', 15);

export const generateGenderId = (): string => 'GEN' + randomize('0', 15);

export const generateKeyMessageId = (): string => 'KM' + randomize('0', 15);

export const generateResponseTimeId = (): string => 'RT' + randomize('0', 15);

export const generateEngagementId = (): string => 'ENGMENT' + randomize('0', 15);

export const generateIncidentId = (id: string): string => 'INC' + id.padStart(7, '0');

export const generateIncidentCategoryIntensityId = (): string => 'INC_CAT_INT' + randomize('0', 15);
