"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { loginSchema } from "@/schemas/schemas";
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
import {  signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";

interface LoginFormInput {
    email: string;
    password: string;
}

export default function LoginForm() {
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: '',
        password: '',
        }
    });

    const router = useRouter();
    

    const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            router.push('/dashboard')
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <Card className="w-full max-w-sm min-w-sm">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Welcome, login to continue with app.</CardDescription>
                <CardAction><Button variant="link" onClick={() => router.push('/signup')}>Sign Up</Button></CardAction>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Email"/>}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Password" type="password"/>}
                            />
                        </div>

                        <Button variant="outline" type="submit" > Submit </Button>

                    </div>
                </form>
            </CardContent>
        </Card>
    )

}