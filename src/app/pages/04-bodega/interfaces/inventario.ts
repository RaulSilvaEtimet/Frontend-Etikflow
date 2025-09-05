export interface BodegaInventarioKardexInterface {
    Ancho: number;
    CodigoBarras: string;
    CodigoInterno: string;
    FechaRegistro: Date;
    IdCompra: number;
    IdEstado: number;
    IdInventario: number;
    IdKardex: number;
    IdPadreKardex: null;
    Largo: number;
    Lote: null;
    PesoCono: number;
    PesoMaterial: number;
    PesoNetoActual: number;
    PesoNetoAnterior: number;
    PesoTotal: number;
    TipoKardex: string;
    TotalM2: number;
    TotalM2Actual: number;
    TotalM2Anterior: number;
    Usuario: string;
    DescripcionEstado: string;
    DescripcionInventario: string;
    RazonSocialProveedor: string;
    PesoSustrato: number;
}

export interface BodegaInventarioTotalizadoInterface {
    CodigoInternoInventario: string;
    CodigoTipoMaterial: string;
    Descripcion: string;
    DesperdicioTotalInventarioM2: number;
    GrupoInventario: string;
    NombreGrupo: string;
    NombreTipoInventario: string;
    PesoConoInventario: number;
    PesoMaterialInventario: number;
    PesoTotalInventario: number;
    TotalInventarioM2: number;
}

export interface BodegaInventarioInformacionInterface {
    CodigoInternoInventario: string;
    CodigoTipoMaterial: string;
    DescripcionInventario: string;
    DesperdicioTotalInventarioM2: number;
    FechaRegistroInventario: Date;
    GrupoInventario: string;
    IdInventario: number;
    IdProveedor: number;
    IdentificacionProveedor: string;
    NombreGrupo: string;
    NombreTipoInventario: string;
    PesoConoInventario: number;
    PesoMaterialInventario: number;
    PesoTotalInventario: number;
    ProveedorNacional: false;
    RazonSocialProveedor: string;
    TipoIdentificacionProveedor: string;
    TotalInventarioM2: number;
}

export interface BodegaInventarioDesgloseDisBobCorInterface {
    BobinasEnCorteM2: number;
    BobinasEnProduccionM2: number;
    BobinasM2: number;
    CodigoInterno: string;
    CortesEnCorteM2: number;
    CortesEnProduccionM2: number;
    CortesM2: number;
    DescripcionInventario: string;
    RazonSocialProveedor: string;
}