import Footer from '@/components/footer'
import Navbar from '@/components/Navbar'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
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
