export interface SubMenuSearchInterface {
    success: boolean;
    data: SubMenuSearchInterfaceSecondLevel[] | SubMenuSearchInterfaceDataSeparator[] | SubMenuSearchInterfaceThirdLevel;
    message: string;
}

export interface SubMenuSearchInterfaceSecondLevel {
    id: number;
    label: string;
    icon: string;
    routerLink?: string;
    items: SubMenuSearchInterfaceThirdLevel[];
}

export interface SubMenuSearchInterfaceThirdLevel {
    id: number;
    label: string;
    icon: string;
    routerLink?: string;
    fk_menu_web_second_level: number;
}

export interface SubMenuSearchInterfaceDataSeparator {
    separator: boolean;
}