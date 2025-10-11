import Image from "next/image";
import Link from 'next/link'

export default function CustomNotFound() {
    return (
        <>
            <main
                className="min-h-full flex justify-center bg-cover bg-top sm:bg-top"
                style={{height: 382}}
            >
                <div className="max-w-7xl mx-auto px-4 py-16 text-center sm:px-6 sm:py-14 lg:px-8 lg:py-18">
                    <p className="text-base font-semibold text-white text-opacity-50">404</p>
                    <h1 className="mt-2 text-4xl font-bold text-white tracking-tight sm:text-5xl sm:tracking-tight">
                        Uh oh! I think you’re lost.
                    </h1>
                    <p className="mt-2 text-lg font-medium text-white text-opacity-50">
                        It looks like the page you’re looking for does not exist.
                    </p>
                    <div className="mt-6">
                        <Link href="/">
                            <p
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black text-opacity-75 bg-white bg-opacity-75 sm:bg-opacity-25 sm:hover:bg-opacity-50"
                            >
                                Go back home
                            </p>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
