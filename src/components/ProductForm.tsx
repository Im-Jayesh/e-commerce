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

interface ProductFormProps {
    onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
    const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ProductFormInput>({
        resolver: zodResolver(productSchema),
        defaultValues: {
        title: '',
        price: 0,
        description: '',
        category: ''
        }
    });

    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState<string>('');
    

    const onSubmit: SubmitHandler<ProductFormInput> = async (data) => {
        try {
            setApiError('');
            const productRef = await addDoc(collection(db, 'products'), {...data, createdAt: new Date().toISOString()});
            setSuccess(true);
            reset();
            setTimeout(() => {
                setSuccess(false);
                if (onSuccess) onSuccess();
            }, 1500);
        } catch(error: any) {
            const errorMessage = error.message || 'Failed to create product';
            setApiError(errorMessage);
            console.log(error);
        }
    };

    return (
        <div className="w-full">
            {success && (
                <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 text-center font-medium">
                    ✓ Product added successfully!
                </div>
            )}
            {apiError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                    {apiError}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-slate-900 dark:text-white font-semibold">Product Title</Label>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Input 
                                        {...field} 
                                        placeholder="e.g. Premium Wireless Headphones"
                                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500 font-medium mt-1">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-slate-900 dark:text-white font-semibold">Description</Label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Textarea 
                                        {...field} 
                                        placeholder="Describe your product..."
                                        className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 min-h-24"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500 font-medium mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price" className="text-slate-900 dark:text-white font-semibold">Price ($)</Label>
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <Input 
                                            {...field} 
                                            placeholder="99.99" 
                                            type="number" 
                                            step="0.01"
                                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                                        />
                                        {errors.price && (
                                            <p className="text-sm text-red-500 font-medium mt-1">
                                                {errors.price.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category" className="text-slate-900 dark:text-white font-semibold">Category</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <Input 
                                            {...field} 
                                            placeholder="Electronics"
                                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        />
                                        {errors.category && (
                                            <p className="text-sm text-red-500 font-medium mt-1">
                                                {errors.category.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-11 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-slate-100 font-semibold transition-all duration-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}