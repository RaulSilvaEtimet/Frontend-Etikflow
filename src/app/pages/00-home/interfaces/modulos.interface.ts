export interface MenuSearchInterface {
    success: boolean;
    data: MenuSearchInterfaceData[];
    message: string;
}

export interface MenuSearchInterfaceData {
    IdPadre: number,
    Id: number,
    Descripcion: string;
    Icono: string;
    Url: string;
}