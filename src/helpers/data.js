const url_api = 'http://192.168.0.185:8000/api/reporte-actividades/q=trabajado,2022-10-04'

export function getData(){
  return fetch(url_api).then(res => res.json())
}