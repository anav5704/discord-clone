"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/useModal"
import { useState } from "react"
import axios from "axios"

export const LeaveServerModal = () => {
    const router = useRouter()
    const { isOpen, onOpen, onClose, type, data } = useModal()
    const { server } = data
    const isModalOpen = isOpen && type === "leaveServer" 
    const [isLoading, setIsLoading] = useState(false)

    const onLeave = async () => {
        try {
            setIsLoading(true)
            await axios.patch(`/api/servers/${server?.id}/leave`)
            router.refresh()
            router.push("/")
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-end w-full gap-x-3">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onLeave} variant="primary">
                            Leave
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent> 
        </Dialog>
    )
}
