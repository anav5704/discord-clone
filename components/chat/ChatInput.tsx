"use client"

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Plus, Smile } from "lucide-react"
import { useForm } from "react-hook-form"
import qs from "query-string"
import axios from "axios"
import * as z from "zod"

interface ChatInputProps {
    apiUrl: string,
    query: Record<string, any>,
    name: string,
    type: "conversation" | "channel"
}

const formSChema = z.object({
    content: z.string().min(1)
})

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const form = useForm<z.infer<typeof formSChema>>({
        defaultValues: {
            content: ""
        },
        resolver: zodResolver(formSChema)
    })

    const isLoading = form.formState.isSubmitting
    const onSubmit = async (value: z.infer<typeof formSChema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query 
            })
            await axios.post(url, value)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button type="button" onClick={() => { }} className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-xinc-300 transition rounded-full p-1 flex items-center justify-center">
                                        <Plus className="text-white dark:text-[#313338] " />
                                    </button>
                                    <Input {...field} placeholder={`Message ${type === "conversation" ? name : "#" + name}`} disabled={isLoading} className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200" />
                                    <div className="absolute top-7 right-8">
                                        <Smile />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}