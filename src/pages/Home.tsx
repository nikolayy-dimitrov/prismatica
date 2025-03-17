import Painter from "../assets/prismatica_hero.jpg"
import SecondPainter from "../assets/prismatica_hero_painting.jpg";
import ThirdPainter from "../assets/prismatica_hero_painting_v2.jpg";

export const Home = () => {
    return <section id="home" className="h-screen flex items-center justify-center font-Inter bg-gradient-to-b from-dark to-midnight">
        <div className="flex flex-col items-center justify-center">
            <img alt="Painter Hero Image" src={SecondPainter}
                 className="absolute" />
            <img alt="Painter Hero Image" src={ThirdPainter}
                 className="absolute -rotate-12 left-20 transition duration-1000 hover:opacity-50" />
            <img alt="Painter Hero Image" src={Painter}
                 className="absolute rotate-12 right-20 transition duration-1000 hover:opacity-50" />
        </div>
    </section>
}