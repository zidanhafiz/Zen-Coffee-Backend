import { Request, Response } from 'express';
import product from '@/models/productModel';
import variant from '@/models/variantsModel';
import { matchedData, validationResult } from 'express-validator';
import cld from '@/utils/cloudinary';
import { Product } from '@/types/constum';
import { getNewVariants } from '@/utils/helper';

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

const getAll = async (req: Request, res: Response) => {
  try {
    const productData = await product.getAll();

    return res.status(200).send({
      message: 'Success get all products',
      data: productData,
    });
  } catch (error) {
    return res.sendStatus(400);
  }
};

const getOneById = async (req: Request, res: Response) => {
  try {
    // Check validation request params
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const params = matchedData(req);
    const id = params.id;

    const productData = await product.getById(id);

    if (!productData) return res.sendStatus(404);

    return res.status(200).send({
      message: 'Success get product',
      data: productData,
    });
  } catch (error) {
    return res.sendStatus(400);
  }
};

const updateOneById = async (req: Request, res: Response) => {
  try {
    // Check validation request params
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);
    const { id, name, description, category, variants, stock, price } = body;

    let imgUrl;

    if (req.files) {
      // Upload to Cloudinary and get img url
      const images = req.files as Array<Express.Multer.File>;
      imgUrl = await Promise.all(
        images.map(async (img) => {
          const base64EncodedImage = Buffer.from(img.buffer).toString('base64');
          const dataUri = `data:${img.mimetype};base64,${base64EncodedImage}`;

          // Use the cloudinary uploader to upload the image
          const response = await cld.uploader.upload(dataUri, { folder: 'products' });
          return { id: response.public_id, url: response.secure_url };
        })
      );
    }

    // Handle product variants
    const dbVariants = await variant.getAll();
    const newVariants = await getNewVariants(variants, dbVariants);

    const productData: Product = { id, name, description, category, stock, price };
    await product.updateOneById(productData, newVariants, imgUrl);

    return res.status(201).send({
      message: 'Success updated product!',
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

const deleteOneById = async (req: Request, res: Response) => {
  try {
    // Check validation request params
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const params = matchedData(req);
    const id = params.id;

    const productData = await product.getById(id);

    if (!productData) return res.sendStatus(404);

    // Delete product image first
    if (productData.images) {
      const productImages = productData.images;
      await Promise.all(
        productImages.map(async (img) => {
          return await cld.uploader.destroy(img.id);
        })
      );
    }

    // Delete product
    await product.deleteOneById(id);

    return res.status(200).send({
      message: 'Success delete the product!',
    });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

export default { getAll, getOneById, createOne, deleteOneById, updateOneById };
