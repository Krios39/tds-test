export const findObjectEdge = <T>(object: T, predicateOnFind: (value: any, key: string) => boolean | void) => {
    for (let prop in object) {
        if (typeof (object[prop]) === 'object') {
            findObjectEdge(object[prop], predicateOnFind);
        } else {
            const bbb = predicateOnFind(object[prop], prop)
            if (bbb) return;
        }
    }
}
