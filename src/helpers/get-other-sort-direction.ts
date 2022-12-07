import {SortDirection} from "../constants/sort-direction.enum";

export const getOtherSortDirection = (prevDirection: SortDirection): SortDirection => {
    return prevDirection === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
}
