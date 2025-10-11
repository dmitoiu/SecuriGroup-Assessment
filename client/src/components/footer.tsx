import Image from "next/image";

export default function Footer() {
    return (
        <>
            <footer style={{position: "fixed", width: "100%", bottom: 0}} className="relative bg-stone-900 bottom-0 z-9" aria-labelledby="footer-heading">
                <div className="align-middle mt-4 border-t border-stone-500 pt-8 md:flex md:items-center md:justify-center">
                    <p className="relative bottom-4 mt-8 px-5 text-base text-gray-400 md:mt-0 md:order-1 align-center text-center">
                        &copy; {new Date().getFullYear()} Darie-Dragoș Mitoiu, All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
