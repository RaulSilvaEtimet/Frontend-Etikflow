export interface AdquisicionOrdenCompraLogInterface {
    DescripcionEstadoCompra: string | null;
    FechaEvento: Date | null;
    IdEstado: number | null;
    IdLogCambioEstado: number | null;
    IdTipoDocumento: number | null;
    Observacion: AdquisicionOrdenCompraLogObservacionInterface[] | null;
    SecuencialDocumento: number | null;
    Usuario: string;
}

export interface AdquisicionOrdenCompraLogObservacionInterface {
    eta: Date | null;
    etd: Date | null;
    fecha: Date | null;
    obs: string;
}
