import { Types } from "mongoose";
import { NextResponse } from "next/server";
import connect from "../../../../../../lib/db";
import User from "../../../../../../lib/modals/user";
import Category from "../../../../../../lib/modals/category";

export const PATCH = async (req, context) => {
  const categoryId = context.params.category;
  try {
    const body = await req.json();
    const { title } = body;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing User id" }),
        { status: 404 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Category id" }),
        { status: 404 }
      );
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({
        message: "Category is Updated",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in updating categories " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (req, context) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userid" }),
        { status: 400 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category id" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in the database" }),
        { status: 404 }
      );
    }
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    return new NextResponse(
      JSON.stringify({
        message: "Category is Deleted",
        category: deletedCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in Deleting categories " + error.message, {
      status: 500,
    });
  }
};
