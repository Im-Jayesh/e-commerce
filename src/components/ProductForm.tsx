"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { productSchema } from "@/schemas/schemas";
import { 
    Card,
    CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label"
import { useRouter } from "next/navigation";
import { auth, db } from '@/lib/firebase';
import { doc,collection, getDoc, addDoc } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";

interface ProductFormInput {
    title: string;
    price: number;
    description: string;
    category: string;
}

export default function LoginForm() {
    const { control, handleSubmit,reset, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
        title: '',
        price: 0,
        description: '',
        category: ''
        }
    });

    const [success, setSuccess] = useState(false);
    

    const onSubmit: SubmitHandler<ProductFormInput> = async (data) => {
        try {
            const productRef = await addDoc(collection(db, 'products'), {...data, createdAt: new Date().toISOString()});
            setSuccess(true);
            reset();
            setTimeout(() => setSuccess(false), 3000);
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <Card className="w-full max-w-sm min-w-sm">
            <CardHeader>
                <CardTitle>Create Product</CardTitle>
                <CardDescription>Welcome, Enter product detials and click List Product.</CardDescription>
            </CardHeader>
            <CardContent>
                {success && <p className="text-green-500 text-center mb-4">Product Listed Successfully!</p>}
                <form onSubmit={handleSubmit(onSubmit)}>


                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="e.g. Ice Cream"/>}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desciption">Description</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => <Textarea {...field} placeholder="Cold Chocolate Ice Cream, very cold!"  />}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500 font-medium">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => (
                                    <Input 
                                    {...field} 
                                    value={field.value || ""}
                                    placeholder="20" 
                                    type="number" 
                                    step="0.01"
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                    />
                                )}
                                />
                            {errors.price && (
                                <p className="text-sm text-red-500 font-medium">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Desert"  />}
                            />
                        </div>

                        <Button variant="outline" type="submit" >{isSubmitting ? "Listing..." : "List Product"}</Button>

                    </div>
                </form>
            </CardContent>
        </Card>
    )

}