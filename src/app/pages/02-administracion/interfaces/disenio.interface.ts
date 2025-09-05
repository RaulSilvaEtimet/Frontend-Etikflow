export interface AdministracionDisenioPantoneInterface {
    IdPantone: number;
    LineaColor: string;
    CodigoDescripcionPantone: string;
}

export interface AdministracionDisenioCirelInterface {
    IdCirel: number;
    FechaRegistro: Date;
    CodigoArte: string;
    NombreProducto: string;
    Cliente: string;
    Cilindro: number;
    Ancho: number;
    Avance: number;
    RepeticionesAvance: number;
    GapAvance: number;
    RepeticionesAncho: number;
    GapAncho: number;
    CantidadColores: number;
    Color1: string;
    Color2: string;
    Color3: string;
    Color4: string;
    Color5: string;
    Color6: string;
    Color7: string;
    Color8: string;
    Color9: string;
    Color10: string;
    Color11: string;
    Color12: string;
    Rebobinado: string;
    Path: string;
    Diseniador: string;
    Usuario: string;
    Estado: boolean;
    IdMaquina: number;
}