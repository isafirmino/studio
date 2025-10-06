"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "../ui/spinner";
import { useEffect } from "react";

const profileSchema = z.object({
  judgingBody: z.string().min(3, "Judging body is required."),
  role: z.string().min(3, "Role is required."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      judgingBody: "",
      role: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        judgingBody: userProfile.judgingBody || "",
        role: userProfile.role || "",
      });
    }
  }, [userProfile, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        judgingBody: data.judgingBody,
        role: data.role,
      });
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      // Force a reload of auth state to update profileComplete
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="judgingBody"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judging Body</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Supreme Court of Justice" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Judge, Lawyer, Clerk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting && (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save and Continue
        </Button>
      </form>
    </Form>
  );
}
