export interface AdquisicionOrdenCompraEnvioKardex {
    CodigoInterno: string | null;
    DescripcionDetalleCompra: string | null,
    Ancho: number | null;
    Largo: number | null;
    TotalM2: number | null;
    PesoMaterial: number | null;
    IdCompra: number | null;
    TipoKardex: string | null;
    IdEstado: number | null;
    Lote: string | null;
    Usuario: string | null;
    GrupoInventario: string | null;
    CodigoTipoInventario: string | null;
    IdProveedor: number | null;
    SecuencialOrdenCompra: number | null;
}
