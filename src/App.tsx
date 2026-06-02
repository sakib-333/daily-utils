import Navbar from "@/components/Navbar"

const App = () => {
  return (
    <div className="min-h-screen bg-background pt-16 text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
        <h1 className="text-3xl font-bold text-primary">Hello World!</h1>
      </main>
    </div>
  )
}

export default App
