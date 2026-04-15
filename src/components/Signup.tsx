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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface SignUpFormInput {
    username: string;
    email: string;
    password: string;
}

export default function SignUpForm() {
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username:'',
        email: '',
        password: '',
        }
    });

    const router = useRouter();

    const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                username: data.username,
                email: user.email,
                role: "user",
                createdAt: new Date().toISOString()
            });

            router.push('/login')
        } catch(error) {
            console.log(error);
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
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Username"/>}
                            />
                        </div>

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

                        <Button variant="outline" type="submit" > Sign up </Button>

                    </div>
                </form>
            </CardContent>
        </Card>
    )

}