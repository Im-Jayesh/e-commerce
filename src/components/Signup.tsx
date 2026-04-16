"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { signupSchema } from "@/schemas/schemas";
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
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useState } from "react";

interface SignUpFormInput {
    username: string;
    email: string;
    password: string;
}

export default function SignUpForm() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username:'',
        email: '',
        password: '',
        }
    });

    const router = useRouter();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string>('');

    const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
        setLoading(true);
        setApiError('');
        try {
            await signup(data.username, data.email, data.password);
            toast.success("Signup successful!");
            router.push('/dashboard')
        } catch(error: any) {
            const errorMessage = error.response?.data?.error || error.message || "Signup failed";
            setApiError(errorMessage);
            toast.error(errorMessage);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm min-w-sm">
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Welcome, Signup.</CardDescription>
                <CardAction><Button variant="link" onClick={() => router.push('/login')}>Log In</Button></CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col gap-6">
                        {apiError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {apiError}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <Input 
                                            {...field} 
                                            placeholder="Username"
                                            className={errors.username ? 'border-red-500' : ''}
                                        />
                                        {errors.username && (
                                            <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <Input 
                                            {...field} 
                                            placeholder="Email"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <Input 
                                            {...field} 
                                            placeholder="Password" 
                                            type="password"
                                            className={errors.password ? 'border-red-500' : ''}
                                        />
                                        {errors.password && (
                                            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <Button variant="outline" type="submit" disabled={loading}> {loading ? "Signing up..." : "Sign up"} </Button>

                    </div>
                </form>
            </CardContent>
        </Card>
    )

}