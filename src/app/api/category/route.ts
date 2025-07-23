import { NextResponse } from 'next/server';
import dbConnect from '../../Deshboard/deshboard/database/db';
import Category from '../../../models/category';
import cloudinary from '../../../components/cloudnary/cloudnary';
import { UploadApiResponse } from 'cloudinary';

interface CloudinaryResponse extends UploadApiResponse {
  public_id: string;
  secure_url: string;
}

// GET: Fetch all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const imageFile = formData.get('image');

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    let imageData = {};
    
    // Upload image to Cloudinary if exists
    if (imageFile) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Convert buffer to base64
        const base64Data = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        
        // Upload to Cloudinary
        const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
          cloudinary.uploader.upload(
            base64Data,
            {
              folder: 'categories',
              resource_type: 'auto'
            },
            (error: Error | undefined, result: CloudinaryResponse | undefined) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error('No result from Cloudinary'));
            }
          );
        });

        imageData = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return NextResponse.json(
          { success: false, error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create category data object
    const categoryData = {
      name,
      description,
      ...(Object.keys(imageData).length > 0 && { image: imageData })
    };

    // Create the category
    const category = await new Category(categoryData).save();

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
