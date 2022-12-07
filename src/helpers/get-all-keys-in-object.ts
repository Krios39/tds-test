import {findObjectEdge} from "./find-object-edge";

export const getAllKeysInObject = <T>(obj: T): string[] => {
    const keys: string[] = []

    findObjectEdge(obj, (_, key) => {
        keys.push(key)
    })
    return keys
}
