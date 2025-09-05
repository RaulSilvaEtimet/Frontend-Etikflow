export interface CierreOrdenProduccionTaurusInterface {
    AplicaIva: string;
    CantidadDesperdicio: number;
    CantidadSolicitada: number;
    Cierre: boolean;
    CodigoFinalProductoTerminado: string;
    CostoIndirecto: number;
    CostoUnitario: number;
    Estado: number;
    FechaEnvio: Date;
    FechaInicio: Date;
    FechaTerminado: Date;
    ManoObra: number;
    NombreProductoEtimet: string;
    NumeroEmpleados: number;
    NumeroHoras: number;
    NumeroLote: string;
    Observaciones: string;
    OpCantidadProducida: number;
    OrdenProduccion: string;
    OrdenProduccionRef: number;
    OrdenProduccionTaurus: string;
    UnidadMedida: string;
}

export interface EnviarCierreOrdenProduccionTaurusInterface {
    IdentificacionCliente: string;
    ProductoCodigo: string;
    ProductoNombre: string;
    AplicaIva: string;
    UnidadMedida: string;
    OpCantidadSolicitada: number;
    OpFechaInicio: Date;
    OpFechaTerminado: Date;
    OpObservaciones: string;
    OpNumeroLote: string;
    OpCantidadProducida: number;
    OpCantidadDesperdicio: number;
    OpNumeroHoras: number;
    OpNumeroEmpleados: number;
    OpManoObra: number;
    OpCostoIndirecto: number;
    OpCostoUnitario: number;
}

export interface OrdenProduccionParcialTaurusInterface {
    AplicaIva: string;
    CantidadDesperdicio: number;
    CantidadSolicitada: number;
    Cierre: boolean;
    CodigoFinalProductoTerminado: string;
    CostoIndirecto: number;
    CostoUnitario: number;
    Estado: number;
    EstadoDescripcion: string;
    FechaEnvio: Date;
    FechaInicio: Date;
    FechaRegistro: Date;
    FechaTerminado: string;
    IdOrdenProducionCargaInventario: string;
    ManoObra: number;
    NombreProductoEtimet: string;
    NumeroEmpleados: number;
    NumeroHoras: number;
    NumeroLote: string | null;
    Observaciones: string;
    OpCantidadProducida: number;
    OrdenProduccion: string;
    OrdenProduccionRef: number;
    OrdenProduccionTaurus: string;
    TipoCierre: string;
    UnidadMedida: string;
}