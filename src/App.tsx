import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./config/firebaseConfig.ts";

import { AuthProvider } from "./context/AuthContext.tsx";

import { Navbar } from "./components/UI/Navbar";
import { Gallery } from "./pages/GalleryPage.tsx";
import { ArtworkDetails } from "./pages/ArtworkDetailsPage.tsx";
import { Artboard } from "./pages/ArtboardPage.tsx";
import { CreateArt } from "./pages/CreateArtPage.tsx";
import { AIArt } from "./components/AIArt.tsx";
import { Profile } from "./pages/ProfilePage.tsx";
import { NotFoundPage } from "./pages/404.tsx";

import GuestGuard from "./guards/GuestGuard.tsx";

function App() {
  return (
      <div className="app">
          <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<Artboard />} />
                <Route element={<GuestGuard />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create" element={<CreateArt />} />
                    <Route path="/ai-art" element={<AIArt />} />
                </Route>
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/:id" element={<ArtworkDetails />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ToastContainer />
          </AuthProvider>
      </div>
  )
}

export default App
