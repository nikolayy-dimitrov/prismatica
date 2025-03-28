import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useContext, useRef } from "react";

import { AuthContext } from "../context/AuthContext.tsx";
import { FlipCard } from "../components/FlipCard.tsx";
import { Footer } from "../components/UI/Footer.tsx";

import Painter from "../assets/prismatica_hero.jpg";
import SecondPainter from "../assets/prismatica_hero_painting.jpg";
import ThirdPainter from "../assets/prismatica_hero_painting_v2.jpg";
import FourthPainter from "../assets/prismatica_hero_painting_v3.jpeg";
import PrismaticaGirl from "../assets/prismatica_girl_mystic.jpeg";
import ShatteredGlass from "../assets/prismatica_shattered_glass_overlay.jpg";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
};

export const Home = () => {
    const { user } = useContext(AuthContext);

    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const functionalityRef = useRef(null);
    const faqRef = useRef(null);

    const isHeroInView = useInView(heroRef, {once: false, amount: 0.3});
    const isAboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
    const isFunctionalityInView = useInView(functionalityRef, { once: true, amount: 0.3 });
    const isFaqInView = useInView(faqRef, { once: true, amount: 0.3 });

    return (
        <div id="home" className="font-Inter bg-gradient-to-b from-black to-midnight text-white">
            {/* Hero Section */}
            <section
                ref={heroRef}
                id="hero" className="h-screen flex items-center justify-center relative overflow-hidden">
                <motion.div
                    initial="hidden"
                    animate={isHeroInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="relative text-center max-w-3xl px-6"
                >
                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl md:text-7xl font-bold leading-tight"
                    >
                        Welcome to <span className="bg-gradient-to-tl tracking-wide from-plum to-midnight bg-clip-text text-transparent brightness-200">
                        Prismatica
                        </span>
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        className="mt-4 text-lg opacity-80"
                    >
                        Discover, share, and celebrate artwork with the world.
                    </motion.p>
                    <motion.div variants={fadeInUp} className="flex justify-center gap-6 mt-6">
                        {!user ?
                            <Link
                                to="/sign-up"
                                className="px-6 py-3 rounded-lg bg-purple-700 hover:bg-plum transition duration-300"
                            >
                                Join Now
                            </Link>
                            : (
                                <Link
                                    to="/artboard"
                                    className="px-6 py-3 rounded-lg bg-purple-700 hover:bg-plum transition duration-300"
                                >
                                    Add Your Art
                                </Link>
                            )
                        }
                        <Link
                            to="/gallery"
                            className="px-6 py-3 rounded-lg border border-gray-300 hover:border-white transition"
                        >
                            View Gallery
                        </Link>
                    </motion.div>
                </motion.div>
                {/* Background Images with Animations */}
                <motion.img
                    src={SecondPainter}
                    alt="Painter Hero Top Left"
                    className="absolute max-md:left-0 md:left-20 top-20 max-md:w-1/2 w-1/4 opacity-60"
                    initial={{opacity: 0, scale: 0.8, rotate: 15}}
                    animate={{opacity: 1, scale: 1, rotate: -15, transition: {duration: 1}}}
                />
                <motion.img
                    src={ThirdPainter}
                    alt="Painter Hero Bottom Left"
                    className="absolute max-md:left-0 md:left-10 bottom-20 max-md:w-1/2 w-1/4 opacity-60"
                    initial={{opacity: 0, scale: 0.8, rotate: -15}}
                    animate={{opacity: 1, scale: 1, rotate: 15, transition: {duration: 1.2}}}
                />
                <motion.img
                    src={Painter}
                    alt="Painter Hero Top Right"
                    className="absolute max-md:right-0 md:right-20 top-20 max-md:w-1/2 w-1/4 opacity-60"
                    initial={{opacity: 0, scale: 0.8, rotate: -15}}
                    animate={{opacity: 1, scale: 1, rotate: 15, transition: {duration: 1}}}
                />
                <motion.img
                    src={FourthPainter}
                    alt="Painter Hero Bottom Right"
                    className="absolute max-md:right-0 md:right-10 bottom-20 max-md:w-1/2 md:w-1/5 opacity-60"
                    initial={{opacity: 0, scale: 0.8, rotate: 15}}
                    animate={{opacity: 1, scale: 1, rotate: -15, transition: {duration: 1.2}}}
                />
            </section>

            {/* About Section */}
            <section
                id="about"
                ref={aboutRef}
                className="py-20 w-11/12 max-md:text-center md:text-left max-w-4xl mx-auto flex max-md:flex-col md:items-start max-md:items-center justify-center gap-8"
            >
                <motion.div
                    initial="hidden"
                    animate={isAboutInView ? "visible" : "hidden"}
                    variants={fadeInScale}
                    className="w-1/2 relative"
                >
                    <img
                        src={PrismaticaGirl}
                        alt="Prismatica Girl"
                        className="w-full rounded-lg blur-[0.6px]"
                    />
                    <div className="absolute inset-0 bg-plum opacity-20"></div>
                </motion.div>
                <motion.div
                    initial="hidden"
                    animate={isAboutInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="flex flex-col flex-grow min-h-[40vh]"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl font-bold tracking-wide
                         bg-gradient-to-br from-plum to-midnight bg-clip-text text-transparent mb-4 brightness-200
                         border-b border-plum py-4"
                    >
                        Discover Prismatica
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-lg text-neutral"
                    >
                        Empowering artists to showcase their creativity, connect with a global community, and receive
                        real-time feedback in an intuitive, modern space.
                    </motion.p>
                    <motion.p
                        variants={fadeInUp}
                        className="max-md:text-sm md:text-md text-charcoal md:mt-auto max-md:mt-12"
                    >
                        Experience a vibrant hub where imagination meets innovation.
                    </motion.p>
                </motion.div>
            </section>


            {/* Functionality Section */}
            <section
                ref={functionalityRef}
                id="functionality" className="py-20 text-center max-md:w-11/12 mx-auto">
                <motion.h2
                    initial="hidden"
                    animate={isFunctionalityInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="text-4xl font-bold bg-gradient-to-br from-plum to-midnight bg-clip-text text-transparent mb-6 brightness-200"
                >
                    Features & Functionality
                </motion.h2>
                <motion.div
                    initial="hidden"
                    animate={isFunctionalityInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-6"
                >
                    <FlipCard
                        front={
                            <div className="h-full flex items-center justify-center px-6 bg-gradient-to-tl from-yellow-400 to-plum rounded-lg shadow-lg overflow-hidden">
                                <img
                                    src={ShatteredGlass}
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[0.75px] mix-blend-overlay"
                                    alt="Overlay"
                                />
                            </div>
                        }
                        back={
                            <div
                                className="h-full flex flex-col items-center justify-center px-6
                                bg-gradient-to-tr from-yellow-400 to-plum
                                rounded-lg shadow-lg overflow-hidden p-4">
                                <h3 className="text-2xl font-bold mb-2 drop-shadow text-plum">
                                    Upload Art
                                </h3>
                                <p className="text-sm text-dark">
                                    Easily upload your artwork with our intuitive interface and share your creativity
                                    with the world.
                                </p>
                            </div>
                        }
                    />
                    <FlipCard
                        front={
                            <div
                                className="h-full flex items-center justify-center px-6 bg-gradient-to-tl from-yellow-400 to-plum rounded-lg shadow-lg overflow-hidden">
                                <img
                                    src={ShatteredGlass}
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[0.75px] mix-blend-overlay"
                                    alt="Overlay"
                                />
                            </div>
                        }
                        back={
                            <div
                                className="h-full flex flex-col items-center justify-center px-6
                                bg-gradient-to-tr from-yellow-400 to-plum
                                rounded-lg shadow-lg overflow-hidden p-4">
                                <h3 className="text-2xl font-bold mb-2 drop-shadow text-plum">
                                    Upload Art
                                </h3>
                                <p className="text-sm text-dark">
                                    Easily upload your artwork with our intuitive interface and share your creativity
                                    with the world.
                                </p>
                            </div>
                        }
                    />
                    <FlipCard
                        front={
                            <div
                                className="h-full flex items-center justify-center px-6 bg-gradient-to-tl from-yellow-400 to-plum rounded-lg shadow-lg overflow-hidden">
                                <img
                                    src={ShatteredGlass}
                                    className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[0.75px] mix-blend-overlay"
                                    alt="Overlay"
                                />
                            </div>
                        }
                        back={
                            <div
                                className="h-full flex flex-col items-center justify-center px-6
                                bg-gradient-to-tr from-yellow-400 to-plum
                                rounded-lg shadow-lg overflow-hidden p-4">
                                <h3 className="text-2xl font-bold mb-2 drop-shadow text-plum">
                                    Upload Art
                                </h3>
                                <p className="text-sm text-dark">
                                    Easily upload your artwork with our intuitive interface and share your creativity with the world.
                                </p>
                            </div>
                        }
                    />
                </motion.div>
            </section>


            {/* FAQ Section */}
            <section
                ref={faqRef}
                id="faq" className="py-20 text-center max-w-4xl mx-auto px-6">
                <motion.h2
                    initial="hidden"
                    animate={isFaqInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="text-4xl font-bold
                    bg-gradient-to-br from-plum to-midnight bg-clip-text text-transparent mb-6 brightness-200"
                >
                    Frequently Asked Questions
                </motion.h2>
                <motion.div
                    initial="hidden"
                    animate={isFaqInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="text-left space-y-6"
                >
                    <motion.div variants={fadeInUp}>
                        <h3 className="text-2xl font-semibold mb-1">
                            How do I upload my artwork?
                        </h3>
                        <p className="opacity-75 text-sm">
                            Simply navigate to the&nbsp;
                            <Link to='/artboard' className="underline underline-offset-2 font-semibold">
                                Artboard
                            </Link>
                            &nbsp;page and start sharing.
                        </p>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <h3 className="text-2xl font-semibold mb-1">
                            Is Prismatica free to use?
                        </h3>
                        <p className="opacity-75 text-sm">
                            Yes, Prismatica is completely free to use.
                        </p>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <h3 className="text-2xl font-semibold mb-1">
                            How can I engage with other artists?
                        </h3>
                        <p className="opacity-75 text-sm">
                            You can engage with other artist by viewing their art in the&nbsp;
                            <Link to="/gallery" className="underline underline-offset-2 font-semibold">
                                Gallery
                            </Link>.
                        </p>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <h3 className="text-2xl font-semibold mb-1">
                            What support is available if I encounter issues?
                        </h3>
                        <p className="opacity-75 text-sm">
                            Our support team is here to help. Visit our&nbsp;
                            <Link to="/support" className="underline underline-offset-2 font-semibold">
                                Help Center
                            </Link> for FAQs, troubleshooting tips, and live assistance.
                        </p>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <h3 className="text-2xl font-semibold mb-1">
                            How secure is my personal information?
                        </h3>
                        <p className="opacity-75 text-sm">
                            Your security is our priority. We use industry-standard encryption and secure authentication
                            methods to keep your data safe.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};
