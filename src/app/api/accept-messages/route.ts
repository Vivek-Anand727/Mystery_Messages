import {getServerSession} from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import { get } from "https";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    const user:User = session?.user;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId = user._id;
    const {acceptMessage} = await request.json();
    

    try {
        const updatedUser = UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessage},
            {new:true}
        )

        if(!updatedUser){
            return NextResponse.json({
                success:false,
                message:"failed to update user status to accept messages"
            },{status:401})
        }

        return NextResponse.json({
            success:true,
            message:"Message acceptance status updated successfully",
            updatedUser
        },{status:200})

    } catch (error) {
        console.log("failed to update user status to accept messages")
        return NextResponse.json({
            success:false,
            message:"failed to update user status to accept messages"
        },{status:500})
    }
}

export async function GET(request:Request) {
    await dbConnect()
    
    const session = await getServerSession(authOptions)
    const user:User = session?.user;

    if(!session || !session.user){
        return NextResponse.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
    
        if(!foundUser){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
    
        return NextResponse.json({
            success:true,
            isAcceptingMessages: foundUser.isAcceptingMessage 
        },{status:200})
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return NextResponse.json({
            success:false,
            message:"Error in getting message acceptance status"
        },{status:500})
    }
} 