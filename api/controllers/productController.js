
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler"

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // find all products
		res.status(200).json({ statusText:"success",message:"all products fetched", products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({  statusText:"fail",message: "Server error", error: error.message });
	}
};



export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json({ statusText:"success",message:"successfully created",product});
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ statusText:"fail", message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ statusText:"fail", message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({  statusText:"success",message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ statusText:"fail", message: "Server error", error: error.message });
	}
};



export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ statusText:"success",message:"succesfull fetched products by category", products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ statusText:"fail", message: "Server error", error: error.message });
	}
};


export const editProduct = asyncHandler(async (req, res) => {
  
    const product=await Product.findByIdAndUpdate(req.body._id,req.body)
	console.log(product)
	console.log(req.body._id,req.body)
    if(!product){
        return res.status(400).json({statusText:"fail",message:"something wrong happened."})
    }
    res.status(201).json({statusText:"success",message:"successfully updated.",product})
});

export const getProduct = asyncHandler(async (req, res) => {
  const productId=req.params.id
  
const product=await Product.findOne({_id:productId})
if(!product){
  return res.status(204).json({statusText:"fail",message:"no product found "})
}
res.status(200).json({statusText:"success",message:"",product})

});

