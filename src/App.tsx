import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./config/firebaseConfig.ts";

import { AuthProvider } from "./context/AuthContext.tsx";

import { Home } from "./pages/HomePage.tsx";
import { Navbar } from "./components/UI/Navbar";
import { Gallery } from "./pages/GalleryPage.tsx";
import { ArtworkDetails } from "./pages/ArtworkDetailsPage.tsx";
import { Artboard } from "./pages/ArtboardPage.tsx";
import { CreateArt } from "./pages/CreateArtPage.tsx";
import { AIArt } from "./pages/AIArtPage.tsx";

import AuthGuard from "./guards/AuthGuard.tsx";
import { SignUp } from "./pages/auth/SignUpPage.tsx";
import { EmailSignUp } from "./pages/auth/EmailSignUpPage.tsx";
import { SignIn } from "./pages/auth/SignInPage.tsx";
import { EmailSignIn } from "./pages/auth/EmailSignInPage.tsx";

import { NotFoundPage } from "./pages/404.tsx";

import GuestGuard from "./guards/GuestGuard.tsx";
import { Profile } from "./pages/ProfilePage.tsx";

function App() {
  return (
      <div className="app">
          <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<GuestGuard />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create" element={<CreateArt />} />
                    <Route path="/ai-art" element={<AIArt />} />
                </Route>
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/:id" element={<ArtworkDetails />} />
                <Route path="/artboard" element={<Artboard />} />
                <Route element={<AuthGuard />}>
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-up/email" element={<EmailSignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-in/email" element={<EmailSignIn />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
              <ToastContainer />
          </AuthProvider>
      </div>
  )
}

export default App
