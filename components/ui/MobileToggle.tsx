import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavSidebar } from "@/components/navigation/NavSidebar"
import { ServerSidebar } from "@/components/server/ServerSidebar "
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger>
                <Button size="icon" variant="ghost" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 gap-0 flex">
                <div className="w-[72px]">
                    <NavSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    )
}

