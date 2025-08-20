import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
export default function App(){
  return (<div style={{maxWidth:960,margin:'0 auto',padding:16,fontFamily:'system-ui, sans-serif'}}>
    <Navbar/>
    <Outlet/>
    <footer style={{marginTop:48,fontSize:12,color:'#777'}}>Azure Static Web Apps + Azure Functions</footer>
  </div>)
}