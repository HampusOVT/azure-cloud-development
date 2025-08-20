import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './ui/App'
import Home from './ui/Home'
import EventDetail from './ui/EventDetail'
import Cart from './ui/Cart'
import Orders from './ui/Orders'
import UploadImage from './ui/UploadImage'
import {CartProvider} from './state/CartContext'

const router = createBrowserRouter([{
    path: '/', element: <App/>, children: [
        {index: true, element: <Home/>},
        {path: 'events/:id', element: <EventDetail/>},
        {path: 'cart', element: <Cart/>},
        {path: 'orders', element: <Orders/>},
        {path: 'upload', element: <UploadImage/>}
    ]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode><CartProvider><RouterProvider router={router}/></CartProvider></React.StrictMode>
)