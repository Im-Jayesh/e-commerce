import z from 'zod';

export const loginSchema = z.object({
    email: z.email("Invalid Email Address"),
    password: z.string().min(8, "Password Should be minimum 8 characters")
})

export const signupSchema = loginSchema.extend({
    username: z.string().min(2, "Username Should be atleast 2 characters").max(25, "Username should at most be 25 chars")
})

export const productSchema = z.object({
    title: z.string(),
    price: z.number().min(0.01, "Price must be greater than 0"),
    description: z.string().max(2000, "Product desciption should be max 2000 charactors"),
    category: z.string()
})