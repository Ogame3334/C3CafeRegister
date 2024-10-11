interface SocketSchema
{
    method: "Account" | "Done" | "RequireItems" | "ItemsUpdate";
    content: object;
}

export type {SocketSchema}
