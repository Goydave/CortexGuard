"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShieldCheck } from "lucide-react";
import type { AnalyzeThreatOutput } from "@/ai/flows/analyze-threat";

const formSchema = z.object({
  content: z
    .string()
    .min(10, "Please enter at least 10 characters to analyze.")
    .max(2000, "Content is too long. Please limit to 2000 characters."),
});

type ScanFormProps = {
    handleScan: (values: z.infer<typeof formSchema>) => Promise<AnalyzeThreatOutput | undefined>;
    isScanning: boolean;
}

export function ScanForm({ handleScan, isScanning }: ScanFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleScan)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Content to Scan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste a URL, email body, SMS message, or any text here..."
                  className="min-h-[200px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isScanning}
          className="w-full h-14 text-xl font-bold"
        >
          {isScanning ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-6 w-6" />
          )}
          Analyze Threat
        </Button>
      </form>
    </Form>
  );
}
