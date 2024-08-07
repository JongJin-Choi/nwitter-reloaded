import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./route/profile";
import Layout from "./components/layout";
import Home from "./route/home";
import Login from "./route/login";
import CreateAccount from "./route/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  {
    path : "/",
    element :(<ProtectedRoute><Layout/></ProtectedRoute>),
    children : [
      {
        path:"",
        element:<Home/>,

      },
      {
        path:"profile",
        element:<Profile/>,

      }
    ]
  },
  {
    path : "/login",
    element : <Login/>
  },
  {
  path : "/create-account",
  element : <CreateAccount/>
  }

])

const GlobalStyle = createGlobalStyle`
  ${reset};

    * {
  box-sizing: border-box;
  }

  body {
  background-color : black;
  color:white;
  font-family  :  'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;


const Wrapper = styled.div`
    height : 100vh;
    display : flex;
    justify-content : center;
`;

function App() {
  const [isLoadiong, setIsLoading] = useState(true);
  const init = async() => {
    // wait for firebase
    await auth.authStateReady();
   setTimeout(() => setIsLoading(false),2000);
  };
  useEffect(() => {
    init()
  }, []);
  return (
    <>
    <Wrapper>
      <GlobalStyle/>
      {isLoadiong? <LoadingScreen/>: <RouterProvider router={router} />}
      </Wrapper>
    </>
  )
}

export default App

