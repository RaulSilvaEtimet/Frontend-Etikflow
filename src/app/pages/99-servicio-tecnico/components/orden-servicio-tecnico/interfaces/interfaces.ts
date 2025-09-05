export interface ServicioTecnicoOrdenClientesInterface {
    codigo: string;
    fecha: Date;
    creador: string;
}

export interface ServicioTecnicoOrdenEquiposInterface {
    id: number;
    modelo: string;
    marca: string;
    serial: string;
    ubicacion: string;
    pgLinealesRecibidos: string;
    pgLinealesEntregados?: string;
    observaciones?: string;
}