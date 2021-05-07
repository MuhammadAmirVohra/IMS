import React, {useMemo, useState} from 'react'
import {useTable} from 'react-table'
import MOCK_DATA from './MOCK_DATA.json'
import {COLUMNS} from './columns'
// import Modal from './Modal'

import './table.css'
 
// function setModal(data){
    
// }


const SepModal = () => {

    // use Memo hook recreation of data is not done on every render. if no new data, dont recalclulate
    const columns = useMemo(()=>COLUMNS, [])
   
    const data = useMemo(()=>MOCK_DATA, [])


    const {

        getTableProps, 
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        // selectedFlatRows

    } = useTable({
        columns,
        data
    }
    )

    // const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [modalInfo, setModal]=useState([]);

    // const handleClose =() =>setShow(false);
    // const handleShow =() =>setShow(true);


    

    return (
        <div>
      
        {show? <div><h1>{modalInfo.requested_fname}</h1>
            <h1>{modalInfo.email}
     
        </h1></div>:null}
        <table {...getTableProps()}>
            <thead> 
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map( (column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>

                        ))}
                    </tr>
                    ))
                }
               
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map( row =>{
                    prepareRow(row)
                    return(
                        // console.log(row.original)
                        <tr {...row.getRowProps()} onClick={ ()=>{
                            setModal(row.original) 
                            setShow(true)
                            
                            
                        }}
                        >
                            {
                                row.cells.map(cell =>{
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>

                                })
                            }
                            
                        </tr>
                    )
                }

                )}
                
            </tbody>
        </table>
        </div>
       
    )
}

export default SepModal;