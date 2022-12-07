import {ReactNode} from "react";

export interface TableHeader {
    id: string
    render: () => ReactNode;
    isSorted: boolean,
    isSortedDesc?: boolean
}
