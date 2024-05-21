import { Request, Response } from 'express';
import product from '@/models/productModel';
import variant from '@/models/variantsModel';
import { matchedData, validationResult } from 'express-validator';
import cld from '@/utils/cloudinary';
import { Product } from '@/types/constum';
import { getNewVariants } from '@/utils/helper';

const getAll = async (req: Request, res: Response) => {
  const data = await product.getAll();
  return res.send(data);
};

const createOne = async (req: Request, res: Response) => {
  try {
    // Check validation request body
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);
    const { name, description, category, variants, stock, price } = body;

    // Handle image product
    if (!req.files)
      return res.status(400).send({ message: `Product's image is required!` });

    const images = req.files as Array<Express.Multer.File>;

    // Upload to Cloudinary and get img url
    const imgUrl = await Promise.all(
      images.map(async (img) => {
        const base64EncodedImage = Buffer.from(img.buffer).toString('base64');
        const dataUri = `data:${img.mimetype};base64,${base64EncodedImage}`;

        // Use the cloudinary uploader to upload the image
        const response = await cld.uploader.upload(dataUri, { folder: 'products' });
        return { id: response.public_id, url: response.secure_url };
      })
    );

    // Handle product variants
    const dbVariants = await variant.getAll();
    const newVariants = await getNewVariants(variants, dbVariants);

    const productData: Product = { name, description, category, stock, price };
    await product.createOne(productData, imgUrl, newVariants);

    return res.status(201).send({
      message: 'Success create new product!',
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

export default { getAll, createOne };
