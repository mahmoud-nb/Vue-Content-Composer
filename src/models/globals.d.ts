export type Tool = {
    name: string;
    component?: string;
}

export type ContentElement = {
    id: number,
    name: string;
    component?: object;
    value?: string;
}

export type ImageOption = {
    id: number; 
    name: string;
    src: string;
}