"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FileUpload } from "@/components/ui/FileUpload"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useModal } from "@/hooks/useModal"
import qs from "query-string"
import axios from "axios"
import * as z from "zod"

export const MessageFileModal = () => {
    const router = useRouter()
    const { isOpen, onClose, type, data } = useModal()
    const { apiUrl, query } = data
    const isModalOpen = isOpen && type === "messageFile"

    const formSchema = z.object({
        fileUrl: z.string().min(1, { message: "Server image is required." })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    })

    const isLoading = form.formState.isSubmitting
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })
            await axios.post(url, {
                ...values,
                content: values.fileUrl
            })
            form.reset()
            router.refresh()
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Upload A File
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        You can add an attachment as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <div className="space-y-8 px-8">
                            <div className="flex items-center justify-center text-center">
                                <FormField control={form.control} name="fileUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload endPoint="messageFile" value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
