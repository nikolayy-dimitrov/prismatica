import { Route, Routes } from "react-router-dom";

import "./config/firebaseConfig.ts";

import { AuthProvider } from "./context/AuthContext.tsx";

import { Home } from "./pages/HomePage.tsx";
import { Navbar } from "./components/UI/Navbar";
import { Gallery } from "./pages/GalleryPage.tsx";
import { Artboard } from "./pages/ArtboardPage.tsx";
import { CreateArt } from "./pages/CreateArtPage.tsx";
import { SignUp } from "./pages/auth/SignUpPage.tsx";

function App() {
  return (
      <div className="app">
          <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/artboard" element={<Artboard />} />
                <Route path="/create" element={<CreateArt />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </AuthProvider>
      </div>
  )
}

export default App
