import type React from "react";
import Header from "../components/header";

const HomePage: React.FC = () => {
   return (
    <>
        <Header />
        <div className="flex h-screen w-screen bg-gray-600">
            <h1>Home Page</h1>
        </div>
    </>
    
   )
}

export default HomePage;