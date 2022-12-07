import {TableColumn} from "../components/Table/models/table-column";
import {TableHeader} from "../components/Table/models/table-header";
import {TableRow} from "../components/Table/models/table-tow";
import {TableCell} from "../components/Table/models/table-cell";
import {useCallback, useEffect, useState} from "react";
import {deepSearch, getAllKeysInObject, getOtherSortDirection} from "../helpers";
import {SortDirection} from "../constants/sort-direction.enum";

interface UseTableProps<T> {
    data: T[];
    columns?: TableColumn<T>[],
    useSortBy?: boolean,
    sortFn?: (columnId: string, direction: SortDirection) => (a: T, b: T) => number,
    filterFn?: (value: T, index: number, array: T[]) => boolean,
}

export const useTable = <T extends object>(props: UseTableProps<T>): { headers: TableHeader[], rows: TableRow[] } => {

    const [sortBy, setSortBy] = useState<{ direction: SortDirection, columnId: string }>({
        direction: SortDirection.Asc,
        columnId: ''
    })
    const [columns, setColumns] = useState<TableColumn<T>[]>([])

    useEffect(() => {
        setColumns(props.columns || (props.data[0] ? getColumnsByData(props.data[0]) : []))
    }, [props.columns, props.data])

    const onHeaderClick = useCallback((column: TableColumn<T>) => {
        if (props.useSortBy) {
            setSortBy(prevState => ({
                columnId: column.id,
                direction: prevState.columnId === column.id ? getOtherSortDirection(prevState.direction) : SortDirection.Asc
            }))
        }
    }, [props.useSortBy])

    const defaultSortFunc = useCallback((a: T, b: T): number => {
        const sortA = deepSearch(a, sortBy.columnId)
        const sortB = deepSearch(b, sortBy.columnId)

        if (typeof sortA === 'string' && typeof sortB === 'string') {
            if (sortA < sortB) {
                return getOtherSortDirection(sortBy.direction)
            }
            if (sortA > sortB) {
                return sortBy.direction
            }
            return 0
        }

        if (typeof sortA === 'number' && typeof sortB === 'number') {
            if (sortBy.direction === SortDirection.Asc) {
                return sortA - sortB
            } else {
                return sortB - sortA
            }
        }

        return 0;
    }, [sortBy])

    const getColumnsByData = useCallback((data: T): TableColumn<T>[] =>
            getAllKeysInObject(data).map(key => ({id: key, accessor: key, header: key})),
        [])

    const getCells = useCallback((row: T, rowIndex: number, columns: TableColumn<T>[]): TableCell[] =>
        columns.map(column =>
            ({
                id: `row-${rowIndex}-${column.id}`,
                render: () => (column?.cell ? column?.cell(row) : (deepSearch(row, column.accessor) || ''))
            })
        ), [])


    const headers: TableHeader[] = columns.map(column => ({
        id: `header-${column.id}`,
        isSorted: sortBy.columnId === column.id,
        isSortedDesc: sortBy.columnId === column.id ? sortBy.direction === SortDirection.Desc : undefined,
        render: () => {
            return (
                <div onClick={() => onHeaderClick(column)}>
                    {typeof column.header === 'string' ? column.header : column.header()}
                </div>
            )
        },
    }))


    const filteredRows = props.filterFn ? props.data.filter(props.filterFn) : props.data

    const sortedRows = props.useSortBy ?
        filteredRows.sort(props.sortFn?.(sortBy.columnId, sortBy.direction) || defaultSortFunc) :
        filteredRows

    const rows = sortedRows.map(
        (row, index) =>
            ({
                id: `row-${index}`,
                cells: getCells(row, index, columns)
            })
    )

    return {
        headers,
        rows
    }
}


