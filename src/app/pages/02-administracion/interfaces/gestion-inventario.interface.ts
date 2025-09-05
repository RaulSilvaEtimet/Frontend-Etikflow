export interface GestionInventarioLineaInventarioInterface {
    CodigoLineaInventario: string | null;
    DescripcionLineaInventario: string | null;
    IdLineaInventario: number | null;
}

export interface GestionInventarioGrupoInventarioInterface {
    CodigoLineaInventario: string | null;
    DescripcionLineaInventario: string | null;
    GrupoInventario: string | null;
    IdGrupoInventario: number | null;
    IdLineaInventario: number | null;
    NombreGrupo: string | null;
    SiglaGrupo: string | null;
}

export interface GestionInventarioTipoInventarioInterface {
    CodigoLineaInventario: string | null;
    CodigoTipoInventario: string | null
    DescripcionLineaInventario: string | null;
    IdGrupoInventario: number | null;
    IdLineaInventario: number | null;
    IdTipoInventario: number | null;
    NombreGrupo: string | null
    NombreTipoInventario: string | null;
}

export interface GestionInventarioProductoInventarioInterface {
    AdherenciaSustrato: string | null;
    CodigoCatalogoSustrato: number | null;
    CodigoInternoSustrato: string | null;
    CodigoLineaInventario: string | null;
    CodigoTipoInventario: string | null;
    DescripcionLineaInventario: string | null;
    DescripcionSustrato: string | null;
    GrupoInventario: string | null;
    IdLineaInventario: number | null;
    IdProveedor: number | null;
    NombreGrupo: string | null;
    NombreTipoInventario: string | null;
    Peso: number | null;
    RazonSocialProveedor: string | null;
    UnidadMedida: string | null;
    ValorUsd: number | null;
    ValorUsdMsi: number | null;
    Adjuntos: string | null;
    IdentificacionProveedor: string | null;
}