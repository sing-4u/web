export interface SongRequestData {
    artist: string;
    title: string;
}

export interface ModalContentProps<T> {
    title?: string;
    errorMessage?: string;
    data?: T;
    buttonBackgroundColor?: string;
}

export enum ModalType {
    DEFAULT,
    ERROR,
    SUCCESS
}
