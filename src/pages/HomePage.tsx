import { Link } from "react-router-dom";

import Painter from "../assets/prismatica_hero.jpg"
import SecondPainter from "../assets/prismatica_hero_painting.jpg";
import ThirdPainter from "../assets/prismatica_hero_painting_v2.jpg";

export const Home = () => {
    return <section
        id="home"
        className="h-screen flex items-center justify-center font-Inter bg-gradient-to-b from-dark to-midnight relative">
        <div className="max-md:relative z-10">
            {/* Background/ Hero Images */}
            <div className="flex flex-col items-center justify-center">
                <img alt="Painter Hero Image" src={SecondPainter}
                     className="absolute z-10" />
                <img alt="Painter Hero Image" src={ThirdPainter}
                     className="absolute -rotate-12 left-20 transition duration-1000 hover:opacity-50 z-20" />
                <img alt="Painter Hero Image" src={Painter}
                     className="absolute rotate-12 right-20 transition duration-1000 hover:opacity-50 z-30" />
            </div>
            {/* Heading */}
            <div>

            </div>
            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-8 relative z-40">
                <Link to="/sign-up" className="bg-gradient-to-br from-plum to-midnight brightness-150 text-gray-400 border-2 border-transparent bg-clip-border rounded-xl px-4 py-2">Join Now</Link>
                <Link to="/gallery" className="bg-gradient-to-br from-white to-neutral bg-clip-text text-transparent border-2 border-neutral rounded-xl px-4 py-2">Gallery</Link>
            </div>
        </div>
    </section>
}