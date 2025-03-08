import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request:Request) {
    await dbConnect();
    
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
        username : searchParams.get('username')
        } 
        const result = UsernameQuerySchema.safeParse(queryParam)  
        
        if(!result.success){
            const UsernameErrors = result.error.format()
            .username?._errors || [];
            return NextResponse.json({
                success : false,
                message : UsernameErrors?.length > 0?
                UsernameErrors.join(', '):'Invalid query parameters'
            },{status:400})
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})

        if(existingVerifiedUser){
            return NextResponse.json({
                success:false,
                message:'Username is already taken'
            },{status:400})
        }

        return NextResponse.json({
            success:true,
            message:'Username is availaible'
        },{status:200})        

    } catch (error) {
        console.error("Error checking username, error")
        return NextResponse.json({
            success:false,
            message:"Error checing username"
        },
        {status:500})
    }
}