import {ReactNode} from "react";

export interface TableColumn<T> {
    id: string;
    header: (() => ReactNode) | string;
    accessor?: string;
    cell?: (item: T) => ReactNode | string;
}
