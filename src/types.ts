export interface SongRequestData {
    artist: string;
    title: string;
}

export interface ModalContentProps {
    title?: string;
    errorMessage?: string;
    data?: SongRequestData;
}
