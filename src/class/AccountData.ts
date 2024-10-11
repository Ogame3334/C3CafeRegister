import { ItemInfo } from "./ItemInfo";

interface AccountData
{
    items: {itemInfo: ItemInfo, count: number, discount: number}[];
    deposit: number;
}

export type {AccountData}
