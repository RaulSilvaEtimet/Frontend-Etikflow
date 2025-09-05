export interface SeguridadesModulosMenusInterface {
    Descripcion: string;
    Habilitado: boolean;
    Icono: string;
    Id: number;
    IdPadre: number;
    MenuId: string;
    Posicion: number;
    Url: string;
}

export interface SeguridadesModulosAsignacionInterface {
    Habilitado: boolean;
    Id: number;
    IdPadre: number;
    MenuId: string;
    Posicion: number;
    Url: string;
    checked: boolean;
    children: SeguridadesModulosAsignacionInterface[];
    expanded: boolean;
    icon: string;
    label: string;
    parent: SeguridadesModulosAsignacionInterface;
}