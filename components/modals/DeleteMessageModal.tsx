"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import { useState } from "react"
import qs from "query-string"
import axios from "axios"

export const DeleteMessageModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal()
    const { apiUrl, query } = data
    const isModalOpen = isOpen && type === "deleteMessage"
    const [isLoading, setIsLoading] = useState(false)

    const onLeave = async () => {
        try {
            setIsLoading(true)
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.delete(url)
            onClose();
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
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure?
                        <br />
                        The message will be permanently deleted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-end w-full gap-x-3">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onLeave} variant="primary">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
