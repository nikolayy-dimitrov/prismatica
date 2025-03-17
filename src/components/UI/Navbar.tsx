import { Link } from "react-router-dom";

export const Navbar = () => {
    return <nav className="md:w-11/12 mx-auto relative flex items-center justify-between py-4 px-8 font-Inter">
        <Link to="/" className="z-40 transition duration-300 active:scale-95">
            <span className="transition duration-300 text-neutral text-2xl font-extrabold brightness-150 tracking-wider">
                PRISMATICA
            </span>
        </Link>
        {/* Main menu */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-12 font-light text-neutral z-40">
            <Link to="/gallery">
                Gallery
            </Link>
            <Link to="/">
                Home
            </Link>
            <Link to="/artboard">
                Artboard
            </Link>
        </div>
        {/* Auth menu */}
        <div>
            <Link to="/sign-up" className="text-neutral brightness-150">
                Join Now
            </Link>
        </div>
    </nav>
}