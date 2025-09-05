export interface AdquisicionesImportacionesImportacionInterface {
    Antiduping: number | null;
    ArancelAdvaloren: number | null;
    ArancelEspecifico: number | null;
    FechaCierre: Date | null
    FechaImportacion: Date | null;
    Fodinfa: number | null;
    GastosDistribuir: number | null;
    IceAdvaloren: number | null;
    IceEspecifico: number | null;
    IdImportacion: number | null;
    Intereses: number | null;
    Iva: number | null;
    Multas: number | null;
    Observacion: string | null
    Otros: number | null;
    Referencia: string | null
    Salvaguardia: number | null;
    SalvaguardiaEspecifica: number | null;
    TasaAduanera: number | null;
    Usuario: string | null;
    ValorLiquidado: number | null;
}

export interface AdquisicionesImportacionesDocumentosLocalesInterface {
    IdImportacionDocumentosLocales: number | null;
    Usuario: string | null;
    IdImportacion: number | null;
    FechaEmision: Date | null;
    TipoDocumento: string | null;
    NumeroDocumento: string | null;
    Proveedor: string | null;
    Total: number | null;
}