export interface Tool {
    id?: string;
    name: string;
    icon?: string;
}

export interface ContentElement {
    id: string;
    name: string;
    component?: object;
    value?: string;
}

export type ImageOption = {
    id: number; 
    name: string;
    src: string;
}