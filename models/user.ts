export interface IUser {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id: string;
    roleId: string;
    firstName: string;
    lastName: string | null;
    email: string;
    avatar: string | null;
}
