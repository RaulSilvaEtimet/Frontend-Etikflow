export interface AdministracionComercialClientesInterface {
    Calificacion: number;
    Celular: string;
    Ciudad: string;
    CodigoCliente: string;
    Descuento: number;
    Dias: number;
    Direccion: string;
    Email: string;
    EstadoCivil: string;
    EstadoCliente: boolean;
    IdCliente: number;
    IdentificacionCliente: string;
    InformaBuroCredito: boolean;
    Monto: number;
    NombreComercial: string;
    NombreUsuario: string;
    OrigenIngresos: string;
    Parroquia: string;
    Provincia: string;
    RazonSocial: string;
    Sexo: string;
    Telefono: string;
    TipoPrecio: string;
    Zona: string;
}

export interface AdministracionComercialTipoTrabajoInterface {
    IdTipoTrabajo: number;
    DescripcionTrabajo: string;
    TrabajoImpreso: boolean;
}

export interface AdministracionComercialTipTraTipInvInterface {
    IdTipoTrabajoTipoInventario: number;
    IdTipoTrabajo: number
    IdTipoInventario: number;
    ValorVentaMPm2: number;
    NombreTipoInventario: string;
    NombreGrupo: string;
    Codigo: string;
}
