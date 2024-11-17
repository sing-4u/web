import { ComponentType } from "react";

export interface SongRequestData {
    artist: string;
    title: string;
}

export interface ModalContentProps<T> {
    title?: string;
    errorMessage?: string;
    data?: T;
    buttonBackgroundColor: string;
}

export enum ModalType {
    DEFAULT,
    ERROR,
    SUCCESS
}

export interface BaseModalProps<T = unknown> {
    title?: string;
    type?: ModalType;
    Content?: ComponentType<ModalContentProps<T>>;
    data?: T;
    buttonBackgroundColor: string;
}
