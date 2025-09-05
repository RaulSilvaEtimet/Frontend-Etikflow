export interface AdministracionPersonalCargosInterface {
    IdCargo: number;
    NombreCargo: string;
}

export interface AdministracionPersonalColaboradorInterface {
    ApellidoColaborador: string;
    EstadoUsuario: boolean;
    FechaIngreso: Date;
    FechaRegistro: Date;
    FechaSalida: Date;
    IdCargo: number;
    IdColaborador: number;
    IdentificacionColaborador: string;
    NombreCargo: string;
    NombreColaborador: string;
    NombreUsuario: string;
    Salario: number;
}