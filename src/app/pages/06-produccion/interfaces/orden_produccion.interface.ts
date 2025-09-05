export interface ProduccionOrdenProduccionInterface {
    IdOrdenProduccion: number;
    FechaRegistro: Date;
    FechaPedido: Date;
    FechaEntrega: Date;
    SecuencialOrdenProduccion: number;
    SecuencialCotizacion: number;
    OrdenCompra: string;
    IdDetalleCotizacion: number;
    RazonSocialCliente: string;
    IdentificacionCliente: string;
    ContactoCliente: string;
    Telefonocliente: string;
    Direccioncliente: string;
    CiudadCliente: string;
    CodigoTrabajo: string;
    NombreTrabajo: string;
    ClaseTrabajo: string;
    Rebobinado: string;
    Cantidad: number;
    Metros2Netos: number;
    Metros2Fijos: number;
    Diferencia: number;
    MetrosLinealesFijos: number;
    MetrosLinealesVariable: number;
    AnchoMaterial: number;
    UnidadesAncho: number;
    UnidadesAvance: number;
    GapAvance: number;
    CodigoArte: string;
    IdProcesoFabricacion: number;
    UnidadZ: string;
    TipoTroquel: string;
    Troquel: string;
    GapLateral: number;
    Maquina: string;
    UnidadesRollo: number;
    DiametroCore: string;
    FilasRollo: number;
    IdEstadoOrdenProduccion: number;
}

export interface ProduccionOrdenProduccionBitacoraInterface {
    DescripcionEstado: string;
    EstadoOP: number;
    FechaRegistro: Date;
    IdBitacoraOrdenProduccion: number;
    IdMaquina: number;
    IdOrdenProduccion: number;
    NombreMaquina: string;
    Observacion: string;
    SecuencialOrdenProduccion: number;
    Usuario: string;
    Colaborador: string;
}

export interface ProduccionMateriaPrimaLiberadaInterface {
    Ancho: number;
    CodigoBarras: string;
    FechaRegistro: Date;
    IdKardex: number;
    IdMaterialKardexOrdenProduccion: number;
    IdOrdenProduccion: number;
    IdPadreKardex: number;
    Largo: number;
    Peso: number;
    TipoRegistro: number;
    TotalM2: number;
    Usuario: string;
}

export interface ProduccionMateriaPrimaLiberadaTipoInventarioInterface {
    CodigoInterno: string;
    NombreTipoInventario: string;
}

export interface ProduccionValoresProduccionInterface {
    IdOrdenProduccionValidacion: number;
    FechaRegistro: Date;
    IdMaquina: number;
    Maquina: string;
    IdOrdenProduccion: number;
    CodigoMaterial: string;
    DescripcionMaterial: string;
    Usuario: string;
    NombreColaborador: string;
    MetroLineal: number;
    Ancho: number;
    M2: number;
    ValorMetrosCalibracion: number;
    CantidadProduccion: number;
    Estado: number;
    IdOrdenProducionCargaInventario: number;
}