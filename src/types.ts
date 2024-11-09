export interface SongRequestData {
    artist: string;
    title: string;
}

export interface ModalContentProps<T> {
    title?: string;
    errorMessage?: string;
    data?: T;
}
