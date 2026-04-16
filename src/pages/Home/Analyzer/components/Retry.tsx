import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Retry({
    message,
    retry,
    className,
}: {
    message?: string
    retry: (() => void) | null
    className?: string
    }) {
    const navigate = useNavigate()
    return (
        <div
            className={cn(
                "w-fit h-fit mx-auto flex flex-col place-items-center justify-between gap-3 rounded-xl border bg-background/60 backdrop-blur-md p-4 shadow-sm",
                className
            )}
        >
            <div className="flex flex-col">
                <span className="text-sm  w-full text-center font-medium text-red-500">
                    Something went wrong
                </span>
                <span className="text-xs text-muted-foreground">
                    {message || "Failed to fetch data. Please try again."}
                </span>
            </div>

            {
                retry ? <Button
                    onClick={() => retry()}
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Retry
                </Button> : <Button
                    onClick={() => navigate(0)}
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-2 cursor-pointer"
                >
                    Refresh
                    <RefreshCcw className="w-4 h-4" />
                </Button>
           }
        </div>
    )
}

export default Retry