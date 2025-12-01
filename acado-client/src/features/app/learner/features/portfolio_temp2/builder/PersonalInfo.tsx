import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { updatePortfolioInfo } from "@services/learner/PortfolioService";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/Input/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/ShadcnButton";

const PersonalInfoSchema = z.object({
    name: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    phone: z.string().nonempty({ message: "Phone number is required" }),
    city: z.string().nonempty({ message: "City is required" }),
    state: z.string().nonempty({ message: "State is required" }),
    country: z.string().nonempty({ message: "Country is required" }),
    about_me: z.string().nonempty({ message: "About is required" }),
});

type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>;

interface PersonalInfoProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
    portfolio: PersonalInfoFormData | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ show, onClose, onSuccess, portfolio }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PersonalInfoFormData>({
        resolver: zodResolver(PersonalInfoSchema),
        defaultValues: {
            name: portfolio?.name || "",
            lastName: portfolio?.lastName || "",
            email: portfolio?.email || "",
            phone: portfolio?.phone || "",
            headline: portfolio?.headline || " ",
            city: portfolio?.city || "",
            state: portfolio?.state || "",
            country: portfolio?.country || "",
            about_me: portfolio?.about_me || "",
        },
    });

    const onSubmit = useCallback(async (data: PersonalInfoFormData) => {
        try {
            await updatePortfolioInfo(data);
            reset();
            onSuccess?.();
            onClose(false);
            toast.success("Personal information updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update personal information. Please try again.");
        }
    }, [reset, onSuccess, onClose]);

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Personal Information</DialogTitle>
                    <DialogDescription>Update your personal details</DialogDescription>
                </DialogHeader>
                <form className="bg-white dark:bg-gray-950" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-3 mb-3">
                        <div>
                            <Label htmlFor="name">First Name</Label>
                            <Input className="bg-ac-dark" id="name" {...register("name")} placeholder="Enter first name" />
                            <p className="text-red-500 text-sm">{errors.name?.message}</p>
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input className="bg-ac-dark" id="lastName" {...register("lastName")} placeholder="Enter last name" />
                            <p className="text-red-500 text-sm">{errors.lastName?.message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-3">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input className="bg-ac-dark" id="email" type="email" {...register("email")} placeholder="Enter email" />
                            <p className="text-red-500 text-sm">{errors.email?.message}</p>
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input className="bg-ac-dark" id="phone" {...register("phone")} placeholder="Enter phone number" />
                            <p className="text-red-500 text-sm">{errors.phone?.message}</p>
                        </div>
                    </div>

                    {/* <div className="flex gap-3 mb-3"> */}
                        {/* <div>
                            <Label htmlFor="headline">Address</Label>
                            <Input className="bg-ac-dark" id="headline" {...register("headline")} placeholder="Enter address" />
                            <p className="text-red-500 text-sm">{errors.headline?.message}</p>
                        </div> */}
                        <div className="mb-3">
                            <Label htmlFor="city">City</Label>
                            <Input className="bg-ac-dark" id="city" {...register("city")} placeholder="Enter city" />
                            <p className="text-red-500 text-sm">{errors.city?.message}</p>
                        </div>
                    {/* </div> */}

                    <div className="flex gap-3 mb-3">
                        <div>
                            <Label htmlFor="state">State</Label>
                            <Input className="bg-ac-dark" id="state" {...register("state")} placeholder="Enter state" />
                            <p className="text-red-500 text-sm">{errors.state?.message}</p>
                        </div>
                        <div>
                            <Label htmlFor="country">Country</Label>
                            <Input className="bg-ac-dark" id="country" {...register("country")} placeholder="Enter country" />
                            <p className="text-red-500 text-sm">{errors.country?.message}</p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <Label htmlFor="about_me">About Me</Label>
                        <Textarea id="about_me" {...register("about_me")} placeholder="Tell us about yourself" className="h-24 bg-ac-dark" />
                        <p className="text-red-500 text-sm">{errors.about_me?.message}</p>
                    </div>
                    <Button className="text-white dark:text-black mt-3" type="submit">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PersonalInfo;
