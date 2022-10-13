import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { getData } from '../../helpers/data'

//PrimeReact
import { FilterMatchMode } from 'primereact/api'
import { MultiSelect } from 'primereact/multiselect'                               //icons
import { Dropdown } from 'primereact/dropdown'
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'  //theme
import 'primereact/resources/primereact.min.css'                  //core css
import 'primeicons/primeicons.css'

export default function Table () {
  const [data, setData] = useState([])
  const [contratistasFilter, setContratistasFilter] = useState([])
  
  const statuses = [ '1', '2', '3' ]

  const [filters] = useState({
    'contratista_nombre_comercial': { value: null, matchMode: FilterMatchMode.IN },
    'estatus': { value: null, matchMode: FilterMatchMode.EQUALS },
  })

  const paginatorTemplate1 = {
    layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    'RowsPerPageDropdown': (options) => {
      const dropdownOptions = [
        { label: 'All', value: options.totalRecords },
          { label: 10, value: 10 },
          { label: 25, value: 25 },
          { label: 50, value: 50 },
          { label: 100, value: 100 }
      ]
      return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
    }
  }

  useEffect(() => {
    let contratistas = []
    getData().then(result => {
      result.map(el => {
        if(el.contratista_nombre_comercial !== null) contratistas.push(el.contratista_nombre_comercial)
        return null
      })
      const contratistaF = new Set(contratistas)
      let contratistaFilter = [...contratistaF]
      setContratistasFilter(contratistaFilter)
      setData(result)
    })
  }, [])

  const statusBodyTemplate = (rowData) => {
    return <span>{rowData.estatus}</span>;
  }

  const statusItemTemplate = (option) => {
    return <span>{option}</span>;
  }

  const statusRowFilterTemplate = (options) => {
    return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Estatus" showClear />;
  }
  
  //filtro de Contratistas
  const contratistaBodyTemplate = (rowData) => {
    return <span>{rowData.contratista_nombre_comercial}</span>
  }

  const contratistaItemTemplate = (option) => {
    return <span className="image-text">{option}</span>
  }

  const contratistaRowFilterTemplate = (options) => {
    return <MultiSelect value={options.value} options={ contratistasFilter } 
    itemTemplate={contratistaItemTemplate} onChange={(e) => options.filterApplyCallback(e.value)}  
    placeholder='Contratista' maxSelectedLabels={1} />;
  }

  // console.log(contratistasFilter)

  return(
    <>
      <div className='bg-slate-100 mx-10 my-5 text-[1.5rem] w-full h-full'>
        <div className='text-white rounded-md'>
          { data.length === 0 ? <div className='text-2xl fw-semibold text-blue-600 p-4'>Cargando Tabla...</div> :
            <DataTable value={data} paginator responsiveLayout='scroll' stripedRows
            paginatorTemplate={paginatorTemplate1} currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" 
            rows={10} filterDisplay="row" filters={filters}> 
              <Column className='py-2 px-4 text-sm' field='contratista_nombre_comercial' header='Contratista'
              filterField="contratista_nombre_comercial" showFilterMenu={false} filterMenuStyle={{ width: '14rem'}} style={{ minWidth: '14rem' }} body={contratistaBodyTemplate}
              filter filterElement={contratistaRowFilterTemplate} sortable></Column>
              <Column className='py-2 px-4 text-sm' field='Proyecto' header='Proyecto' sortable></Column>
              <Column className='py-2 px-4 text-sm' field='documento' header='Documento' sortable></Column>
              <Column className='py-2 px-4 text-sm' field='estatus' header='Estatus' sortable 
              showFilterMenu={false} style={{ width: '7rem'}} 
              body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate}></Column> 
              <Column className='py-2 px-4 text-sm' field='trabajado' header='Trabajado' sortable></Column>
              <Column className='py-2 px-4 text-sm' field='trabajado_por' header='Trabajado por' sortable></Column>
            </DataTable>
          }
        </div>
      </div>
    </>
  )
}