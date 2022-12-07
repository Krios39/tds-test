import {ReactNode} from "react";

export interface TableCell {
    id: string
    render: () => (ReactNode | string);
}
