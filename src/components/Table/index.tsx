import React from "react";
import { SortDirection } from "../../constants/sort-direction.enum";
import {useTable} from "../../hooks/use-table.hook";
import {TableColumn} from "./models/table-column";
import './style.css'

/**
 * Табличка
 * @param {object[]} data - массив объектов для отображения в таблице. Если не используете колонки, то рекомендуется проследить чтобы все ключи (даже вложенные) у объекта были уникальными, в противном случае в одной строке могут совпадать ключи
 * @param {object[]} columns - массив колонок
 * @param {boolean} sorted - флаг, говорящий нужна ли сортировка в таблице
 * @param {function} callback - A callback to run.
 * @param {function} filterFn - функция для фильтрации
 */
interface TableProps<T extends object> {
    data: T[],
    columns?: TableColumn<T>[],
    sorted?: boolean,
    sortFn?: (columnId: string, direction: SortDirection) => (a: T, b: T) => number,
    filterFn?: (value: T, index: number, array: T[]) => boolean,
}

export const Table = <T extends object>({data, columns, sortFn, sorted, filterFn}: TableProps<T>) => {

    const {headers, rows} = useTable({
            data,
            columns,
            useSortBy: sorted,
            sortFn: sorted ? sortFn : undefined,
            filterFn
        }
    )

    return (
        <table>
            <thead>
            <tr>
                {headers.map(header => (
                    <th key={header.id}>
                        <div>
                            {header.render()}
                            {header.isSorted
                                ? header.isSortedDesc
                                    ? ' 🔽'
                                    : ' 🔼'
                                : ''}
                        </div>
                    </th>
                ))}
            </tr>
            </thead>

            <tbody>
            {rows.map(row =>
                <tr key={row.id}>
                    {row.cells.map(cell =>
                        <td key={cell.id}>
                            {cell.render()}
                        </td>
                    )}
                </tr>
            )}

            </tbody>
        </table>
    )
}
