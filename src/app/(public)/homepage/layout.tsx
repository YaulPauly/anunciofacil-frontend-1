import type {ReactNode} from 'react';
import { Navbar } from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';

export default function HomepageLayout({children}: {children: ReactNode}) {

    return(
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    )

}