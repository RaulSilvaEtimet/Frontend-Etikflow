export interface SeguridadesAdministracionRolInterface {
    RoleId: string;
    RoleName: string;
}

export interface SeguridadesAdministracionUsuarioInterface {
    Email: string;
    IsApproved: boolean;
    IsLockedOut: boolean;
    RoleId: string;
    RoleName: string;
    UserId: string;
    UserName: string;
}
