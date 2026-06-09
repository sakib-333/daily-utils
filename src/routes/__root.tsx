import Footer from '@/components/footer'
import Navbar from '@/components/Navbar'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase.config"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {

    // ───────────────── Firestore Config ─────────────────
    useEffect(() => {
        const updateVisitorCount = async () => {
            if (localStorage.getItem("visited")) return;

            const ref = doc(db, "stats", "visitors");

            const snapshot = await getDoc(ref);

            if (!snapshot.exists()) {
                await setDoc(ref, { count: 1 });
            } else {
                await updateDoc(ref, {
                    count: increment(1),
                });
            }

            localStorage.setItem("visited", "true");
        };

        updateVisitorCount();
    }, []);

    return (
        <div className="min-h-screen bg-background pt-16 text-foreground">
            <Navbar />
            <main className="mx-auto max-w-7xl py-10 min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
