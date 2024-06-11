import { Types } from "mongoose";
import { NextResponse } from "next/server";
import User from "../../../../../../lib/modals/user";
import Category from "../../../../../../lib/modals/category";
import Blog from "../../../../../../lib/modals/blog";
import connect from "../../../../../../lib/db";

export const GET = async (req, context) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing User Id",
        }),
        { status: 400 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing Category Id",
        }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing Blog Id",
        }),
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "No user in the database" }),
        { status: 404 }
      );
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "No category in the database" }),
        { status: 404 }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "No Blog in the database" }),
        { status: 404 }
      );
    }
    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error) {
    return new NextResponse("Error in fetching Blog " + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (req, context) => {
  const blogId = context.params.blog;
  try {
    const body = req.json();
    const { title, description } = body;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing User Id",
        }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing Blog Id",
        }),
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "No user in the database" }),
        { status: 404 }
      );
    }
    const blog = await Blog.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "No Blog in the database" }),
        { status: 404 }
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({ message: "Blog Updated", blog: updatedBlog }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Error in updating Blog " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (req, context) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing User Id",
        }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or missing Blog Id",
        }),
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "No user in the database" }),
        { status: 404 }
      );
    }
    await Blog.findByIdAndDelete(blogId);
    return new NextResponse(JSON.stringify({ message: "Blog Deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error in Deleting Blog " + error.message, {
      status: 500,
    });
  }
};
