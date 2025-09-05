export interface LoginSearchInterface {
    success: boolean;
    data: LoginSearchInterfaceData[];
    message: string;
}

export interface LoginSearchInterfaceData {
    UserId: string;
    UserName: string;
    RoleName: string;
    Token: string;
    Ambiente: string;
}