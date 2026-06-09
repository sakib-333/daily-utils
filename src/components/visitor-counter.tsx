import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"

import { db } from "../../firebase.config"

const VisitorCounter = () => {
    const [count, setCount] = useState<number | null>(null)

    useEffect(() => {
        const getVisitorCount = async () => {
            try {
                const ref = doc(db, "stats", "visitors")
                const snapshot = await getDoc(ref)
                const totalVisits = snapshot.data()?.count

                setCount(typeof totalVisits === "number" ? totalVisits : 0)
            } catch {
                setCount(0)
            }
        }

        getVisitorCount()
    }, [])

    return (
        <div className="rounded-full border border-border/70 bg-background/85 px-4 py-2 text-sm font-semibold text-foreground shadow-sm backdrop-blur">
            Total visit: {count === null ? "..." : count.toLocaleString()}
        </div>
    )
}

export default VisitorCounter
