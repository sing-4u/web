import { ComponentType } from "react";
import { NavigateFunction } from "react-router-dom";

export interface SongRequestData {
    artist: string;
    title: string;
}

export interface ModalContentProps<T> {
    title?: string;
    errorMessage?: string;
    data?: T;
    buttonBackgroundColor: string;
    navigate?: NavigateFunction | undefined;
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
