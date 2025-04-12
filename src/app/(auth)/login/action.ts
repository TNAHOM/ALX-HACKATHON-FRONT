'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    if (error) {
        redirect('/error')
    }


    revalidatePath('/', 'layout')
    redirect('/')
}


export async function signup(formData: FormData) {
    const supabase = await createClient();

    // Type-casting here for convenience
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string, // Assuming you have a name field in your form
    };

    // Sign up the user
    const { data: userData, error } = await supabase.auth.signUp(data);

    if (error) {
        redirect('/error');
    }

    // Create a profile for the user
    const role = 'admin'; // Set the desired role here
    console.log('User data:', userData); // Log the user data for debugging
    const { error: UserError } = await supabase
        .from('User') // Replace with your actual table name
        .insert([{ id: userData.user?.id, email: userData.user?.email, role: role, name: data.name }]); // Assuming 'id' is the foreign key linking to auth.users

    if (UserError) {
        console.log('Error creating user:', UserError);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}