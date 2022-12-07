import {findObjectEdge} from "./find-object-edge";

export const deepSearch = <T>(obj: T, searchKey?: string): string | number => {
    if (!searchKey) return '';
    let searchResult

    findObjectEdge(obj, (value, key) => {
        if (searchKey === key) {
            searchResult = value
            return true
        }
    })
    return searchResult || ''
}

