interface PostDataSchema
{
    name: string;
    kind: string;
    price: string;
    discount: string;
    count: string;
    type: "food" | "drink" | "goods";
}
interface CSVDataSchema
{
    accountId: string;
    name: string;
    kind: string;
    price: string;
    discount: string;
    count: string;
    type: "food" | "drink" | "goods";
}

export type {PostDataSchema, CSVDataSchema}
