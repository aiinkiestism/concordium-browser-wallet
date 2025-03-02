/* eslint-disable @typescript-eslint/no-explicit-any */
import { GtuAmount, AccountAddress } from '@concordium/web-sdk';

const types = {
    BigInt: 'bigint',
    Date: 'date',
    GtuAmount: 'gtuAmount',
    AccountAddress: 'accountAddress',
};

function isGtuAmount(cand: any): cand is GtuAmount {
    return cand && typeof cand.microGtuAmount === 'bigint';
}

function isAccountAddress(cand: any): cand is AccountAddress {
    return cand && typeof cand.address === 'string' && cand.address.length === 50;
}

function replacer(this: any, k: string, v: any) {
    if (typeof v === types.BigInt) {
        return { '@type': types.BigInt, value: v.toString() };
    }
    if (this[k] instanceof Date) {
        return { '@type': types.Date, value: v };
    }
    if (isGtuAmount(v)) {
        return { '@type': types.GtuAmount, value: v.microGtuAmount.toString() };
    }
    if (isAccountAddress(v)) {
        return { '@type': types.AccountAddress, value: v.address };
    }
    return v;
}

export function stringify(input: any) {
    return JSON.stringify(input, replacer);
}

export function parse(input: string | undefined) {
    if (!input) {
        return undefined;
    }
    return JSON.parse(input, (_, v) => {
        if (v) {
            switch (v['@type']) {
                case types.BigInt:
                    return BigInt(v.value);
                case types.Date:
                    return new Date(v.value);
                case types.GtuAmount:
                    return new GtuAmount(BigInt(v.value));
                case types.AccountAddress:
                    return new AccountAddress(v.value);
                default:
                    return v;
            }
        }
        return v;
    });
}
