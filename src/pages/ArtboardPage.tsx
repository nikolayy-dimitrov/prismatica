import { Link } from "react-router-dom";

export const Artboard = () => {
    return (
        <section
            id="artboard"
            className="max-h-full py-20 flex flex-col items-center justify-center bg-dark text-neutral px-4"
        >
            <h1 className="text-4xl font-bold mb-8">Create Your Masterpiece</h1>
            <div className="flex flex-col sm:flex-row gap-8">
                {/* Option 1: Upload Artwork */}
                <div className="bg-charcoal p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 w-full sm:w-96">
                    <h2 className="text-2xl font-semibold mb-4">Upload Artwork</h2>
                    <p className="mb-4">
                        Select an existing artwork file from your device to showcase your art.
                    </p>
                    <Link
                        to="/upload"
                        className="bg-plum text-white px-4 py-2 rounded hover:bg-midnight transition"
                    >
                        Upload
                    </Link>
                </div>
                {/* Option 2: Create New Artwork */}
                <div className="bg-charcoal p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 w-full sm:w-96">
                    <h2 className="text-2xl font-semibold mb-4">Create New Artwork</h2>
                    <p className="mb-4">
                        Start a new creation using our digital tools and express your vision.
                    </p>
                    <Link
                        to="/create"
                        className="bg-plum text-white px-4 py-2 rounded hover:bg-midnight transition"
                    >
                        Create
                    </Link>
                </div>
            </div>
        </section>
    );
};
