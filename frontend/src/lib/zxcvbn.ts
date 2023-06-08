import { zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnFrPackage from '@zxcvbn-ts/language-fr';

const options = {
    translations: zxcvbnFrPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnFrPackage.dictionary
    }
};

zxcvbnOptions.setOptions(options);

export const zxcvbnPasswordStrength = (password: string): ZxcvbnResult => {
    return zxcvbn(password);
};
