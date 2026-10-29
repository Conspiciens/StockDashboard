import { NavigationBar } from "../components/NavigationBar";
import { Outlet, useLocation } from 'react-router-dom';

export default function RootLayout() {

  return (
    <>
      <NavigationBar /> 
        <main>
          <Outlet /> 
        </main>
    </>
  );
}