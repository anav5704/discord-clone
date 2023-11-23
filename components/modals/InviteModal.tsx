"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useModal } from "@/hooks/useModal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useOrigin } from "@/hooks/useOrigin"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import axios from "axios"

export const InviteModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal()
    const origin = useOrigin()
    const { server } = data
    const isModalOpen = isOpen && type === "invite"
    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 2500);
    }

    const onNew = async () => {
        try {
           setIsLoading(true)
           const response = await axios.patch(`/api/servers/${server?.id}/invite-code`) 
           onOpen("invite", { server: response.data })
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
                        Invite People
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase font-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading} value={inviteUrl} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" />
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {copied ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <Button disabled={isLoading} onClick={onNew} variant="link" size="sm" className="text-xs text-zinc-500 mt-4jkk">
                        Generate a new link
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
