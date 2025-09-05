export interface AdministracionProduccionMaquinaInterface {
    AniosDepreciacion: number;
    CargoMantenimiento: number;
    Costo: number;
    Estado: boolean;
    FactorPorcentajeMantenimiento: number;
    FechaAdquisicion: Date;
    FechaFin: Date;
    HorasDepreciacion: number;
    HorasUsoAnualEstimado: number;
    IdMaquina: number;
    Modelo: string;
    Nombre: string;
    PorcentajeInteres: number;
    PorcentajeSeguro: number;
    PorcentajeValorResidual: number;
    Potencia: string;
    TotalValorResidual: number;
    ValorDepreciacionHora: number;
    ValorInversion: number;
    ValorSeguro: number;
    VelocidadNominal: number;
}

export interface AdministracionProduccionCargoConsumosInterface {
    DescripcionGasto: string;
    DescripcionMedidaGasto: string;
    IdGastosVariosMaquinas: number;
    ValorUnitario: number;
}

export interface AdministracionProduccionMaquinaGastosFuncionamientoInterface {
    CantidadUsoHora: number;
    DescripcionGasto: string;
    DescripcionMedidaGasto: string;
    IdGastosVariosMaquinas: number;
    IdMaquina: number;
    IdMaquinaGastoFuncionamiento: number;
    ValorUnitario: number;
    ValorUsoHora: number;
}

export interface AdministracionProduccionMaquinaOperadorInterface {
    Colaborador: string;
    Estado: boolean;
    IdColaborador: string;
    IdMaquina: string;
    IdMaquinaOperador: number;
    Salario: number;
}

export interface AdministracionProduccionMaquinaResumenInterface {
    SubTotalCargosConsumo: number;
    SubTotalCargosFijos: number;
    SubTotalHoraOperarios: number;
    ValorHoraMaquina: number;
}

export interface AdministracionProduccionTipoCilindrosInterface {
    IdTipoCilindro: number;
    DescripcionTipoCilindro: string;
}

export interface AdministracionProduccionCategoriaCilindrosInterface {
    IdCategoriaCilindro: number;
    CantidadDientes: number;
}

export interface AdministracionProduccionCilindrosInterface {
    IdCilindro: number;
    DescripcionCilindro: string;
    AnchoCilindroMm: number;
    DesarrolloCilindroMm: number;
    IdTipoCilindro: number;
    DescripcionTipoCilindro: string;
    IdCategoriaCilindro: number;
    CantidadDientes: number;
}

export interface AdministracionProduccionFormatoTroquelesInterface {
    IdFormatoTroquel: number;
    DescripcionFormatoTorquel: number;
}

export interface AdministracionProduccionTipoTroquelesInterface {
    IdTipoTroquel: number;
    DescripcionTipoTroquel: string;
}

export interface AdministracionProduccionTroquelesInterface {
    IdTroquel: number;
    DescripcionTroquel: string;
    CodigoInternoTroquel: string;
    ZetaTroquel: number;
    AnchoTotalTroquel: number;
    DesarrolloTotalTroquel: number;
    AnchoTrabajoTroquel: number;
    DesarrolloTrabajoTroquel: number;
    AnchoEtiqueta: number;
    DesarrolloEtiqueta: number;
    CantidadTrabajosAncho: number;
    CorteRecto: boolean;
    GapEntreTrabajos: number;
    TotalGapEntreTrabajos: number;
    EtiquetasRolloAncho: number;
    GapEntreEtiquetas: number;
    TotalGapEntreEtiquetas: number;
    RepeticionesAncho: number;
    RepeticionesDesarrollo: number;
    TotalEtiquetas: number;
    AnchoSugerido: number;
    IdFormatoTroquel: number;
    IdTipoTroquel: number;
    Estado: boolean;
    GapDesarrollo: number;
    GapTotalDesarrollo: number;
}

export interface AdministracionProduccionConoInterface {
    IdCono: number;
    DescripcionCono: string;
    MedidaCono: number;
    SiglaCono: string;
}

export interface AdministracionProduccionRebobinadoInterface {
    IdRebobinado: number;
    DescripcionRebobinado: string;
}

export interface AdministracionProduccionAcabadoInterface {
    IdAcabado: number;
    DescripcionAcabado: string;
    PrecioMillar: number;
}