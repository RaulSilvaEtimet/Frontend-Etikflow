export interface BodegaOrderCorteCabeceraInterface {
    DescripcionEstado: string | null,
    Estado: number | null;
    FechaRegistroOrdenCorte: Date | null;
    IdOrdenCorte: number | null;
    Secuencial: number | null;
    Usuario: string | null;
}

export interface BodegaOrdenCorteKardexInterface {
    Ancho: number | null;
    AnchoMedido: number | null;
    CodigoBarras: string | null;
    CortesIguales: number | null;
    DescripcionEstado: string | null;
    DescripcionInventario: string | null;
    Estado: number | null;
    FechaHoraFin: Date | null;
    FechaHoraInicio: Date | null;
    IdKardex: number | null;
    IdOrdenCorte: number | null;
    IdOrdenCorteKardex: number | null;
    IdProveedor: number | null;
    IdentificacionProveedor: string | null;
    Largo: number | null;
    LargoMedido: number | null;
    MedidasDiferentes: number | null;
    NumeroCortes: number | null;
    Peso: number | null;
    UsuarioInicio: string | null;
    RazonSocialProveedor: string | null;
    UsuarioFin: string | null;
    Observacion: string | null;
}

export interface BodegaOrdenCorteDescripcionInterface {
    AnchoCorte: string | null;
    IdDescripcionOrdenCorte: number | null;
    IdOrdenCorte: number | null;
    LargoCorte: number | null;
    Parada: number | null;
}

export interface BodegaOrdenCorteResultadoInterface {
    AnchoCorte: number | null;
    CodigoBarrasCorte: string | null;
    IdKardex: number | null;
    IdOrdenCorteKardex: number | null;
    IdResultadoOrdenCorte: number | null;
    LargoCorte: number | null;
    Referencia: number | null;
    Tipo: string | null;
    Usuario: string | null;
}