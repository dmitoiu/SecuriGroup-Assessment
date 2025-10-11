import Image from "next/image";
import { ReactNode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header"
import Footer from "@/components/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <div
                className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-2 gap-1 sm:p-2`}
            >
                <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                    <Header/>
                    <div className={"items-center"} style={{width: "100%", maxHeight: "300px"}}>
                        <main>
                            {children}
                        </main>
                    </div>
                    <Footer/>
                </main>
            </div>
        </>
    );
}
