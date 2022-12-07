import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import {Table} from './components/Table';
import {TableColumn} from "./components/Table/models/table-column";
import { SortDirection } from './constants/sort-direction.enum';
import {deepSearch, getOtherSortDirection} from "./helpers";

interface User {
    id: number,
    email: string,
    name: string,
    username: string,
    website: string,
    phone: string,
}

enum Filter {
    IdMoreThan5 = 'Id More Than 5',
    UsernameLongerThan6 = 'Username Longer Than 6',
    PhoneStartWith0Or1Or2Or3 = 'Phone Start With 0 Or 1 Or 2 Or 3',
    Nothing = 'Nothing'
}

const filteredFuncs = {
    [Filter.IdMoreThan5]: (item: User) => item.id > 5,
    [Filter.UsernameLongerThan6]: (item: User) => item.username.length > 5,
    [Filter.PhoneStartWith0Or1Or2Or3]: (item: User) => item.phone[0] === '0' || item.phone[0] === '1' || item.phone[0] === '2' || item.phone[0] === '3',
    [Filter.Nothing]: undefined,
}

const filterName = {
    [Filter.IdMoreThan5]: 'id больше 5',
    [Filter.UsernameLongerThan6]:'имя польхователя длинне 6',
    [Filter.PhoneStartWith0Or1Or2Or3]: 'номер телефона начинается с 0 или 1 или 2 или 2',
    [Filter.Nothing]: 'убрать фильтрацию',
}

function App() {
    const [users, setUsers] = useState<User[]>([])
    const [chosenFilter, setChosenFilter] = useState<Filter>(Filter.Nothing)

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => setUsers(json))
    }, [])

    const columns: TableColumn<User>[] = [
        {
            id: 'id',
            accessor: 'id',
            cell: (item) => {
                return (<div>{item.id}</div>)
            },
            header: () => {
                return <div>'id' </div>
            }
        },
        {
            id: 'email',
            accessor: 'email',
            header: 'email111'
        },
        {
            id: 'name',
            accessor: 'name',
            cell: (item) => {
                return (<div>{item.name}</div>)
            },
            header: () => {
                return <div>'name' </div>
            }
        },
        {
            id: 'username',
            accessor: 'username',
            cell: (item) => {
                return (<div>{item.username}</div>)
            },
            header: () => {
                return <div>'username' </div>
            }
        },
        {
            id: 'website',
            accessor: 'website',
            cell: (item) => {
                return (<div>{item.website}</div>)
            },
            header: () => {
                return <div>'website </div>
            }
        },
        {
            id: 'phone',
            accessor: 'phone',
            cell: (item) => {
                return (<div>{item.phone}</div>)
            },
            header: 'phone111'

        },
    ]

    const sortedFunc = useCallback ((columnId: string, direction: SortDirection) => (a: User, b: User) => {
        const sortA = deepSearch(a, columnId)
        const sortB = deepSearch(b, columnId)

        if (typeof sortA === 'string' && typeof sortB === 'string') {
            if (sortA < sortB) {
                return getOtherSortDirection(direction)
            }
            if (sortA > sortB) {
                return direction
            }
            return 0
        }

        if (typeof sortA === 'number' && typeof sortB === 'number') {
            if (direction === SortDirection.Asc) {
                return sortA - sortB
            } else {
                return sortB - sortA
            }
        }

        return 0;
    },[])

    const func = useMemo(()=>filteredFuncs[chosenFilter],[chosenFilter])

    return (
        <div className="App">
            <div className={'buttons'}>
                <b>фильтры</b>
                {Object.values(Filter).map(filter=>
                <button key={filter} onClick={()=>setChosenFilter(filter)}>
                    {filterName[filter]}
                </button>
                )}
            </div>

            <Table columns={columns} data={users} sorted sortFn={sortedFunc} filterFn={func}/>
        </div>
    );
}

export default App;











