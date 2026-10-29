import { createBrowserRouter, Route, RouterProvider, useParams} from "react-router-dom";

import './App.css';
import RootLayout from "./layouts/Rootlayout";

import Main from './pages/Main';
import About from './pages/About';
import TradingView from './pages/TradingView';


const router = createBrowserRouter([
  {
    element: <RootLayout />, // Wraps your pages with the Navbar
    children: [
      { path: "/", element: <Main />},
      { 
        path: "/TradingView/:tickSymbol", 
        element: <TradingView />,
      }
    ]
  },
  {
    path: "/about", 
    element: <About />
  },
]);


function App() {
  return <RouterProvider router={router} />
}

export default App
