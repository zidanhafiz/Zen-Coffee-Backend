import { Request, Response } from 'express';
import productsModel from '@/models/products/productsModel';
import imagesModel from '@/models/products/imagesModel';
import variantsModel from '@/models/variantsModel';
import { matchedData, validationResult } from 'express-validator';
import cld from '@/utils/cloudinary';
import { Product, productImg } from '@/types/constum';
import { getNewVariants } from '@/utils/helper';

const createOne = async (req: Request, res: Response) => {
  try {
    // Check validation request body
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);
    const { name, description, category, variants, stock, price } = body;

    // Handle image product
    if (req.files?.length === 0)
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
    const dbVariants = await variantsModel.getAll();
    const newVariants = await getNewVariants(variants, dbVariants);

    const productData: Product = { name, description, category, stock, price };
    await productsModel.createOne(productData, imgUrl, newVariants);

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
    // Check validation request params
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const query = matchedData(req);

    const name = query.name ? query.name : '';
    const category = query.category ? query.category : 'all';
    const orderBy = query.orderBy ? query.orderBy : 'name';
    const sort = query.sort ? query.sort : 'asc';

    const productData = await productsModel.getAll(name, category, orderBy, sort);

    return res.status(200).send({
      message: 'Success get all products',
      data: productData,
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const getOneById = async (req: Request, res: Response) => {
  try {
    // Check validation request params
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const params = matchedData(req);
    const id = params.id;

    const productData = await productsModel.getById(id);

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
    const { id, name, description, category, variants, stock, price, imagesUrl } = body;

    // Handle product variants
    const dbVariants = await variantsModel.getAll();
    const newVariants = await getNewVariants(variants, dbVariants);

    const productData: Product = { id, name, description, category, stock, price };

    // Delete unused product's image first
    const dbImages = await imagesModel.getAll(id);
    const dbImageIds = dbImages.map((img) => img.id);

    if (imagesUrl) {
      // Check if images url is exist on DB or not
      for (const img of imagesUrl) {
        // If doesn't exist throw error for prevent unknown image source
        if (!dbImageIds.includes(img)) {
          return res.sendStatus(404);
        }
      }

      // Delete all images that unused on cloudinary and DB
      await Promise.all(
        dbImageIds.map(async (id) => {
          if (!imagesUrl.includes(id)) {
            await cld.uploader.destroy(id);
            await imagesModel.deleteOneById(id);
          }
        })
      );
    } else {
      // If imagesUrl is empty delete all images on cloudinary and DB
      await Promise.all(
        dbImageIds.map(async (id) => {
          await cld.uploader.destroy(id);
          await imagesModel.deleteOneById(id);
        })
      );
    }

    // If there are new product's image
    let newImagesUrl: productImg[] = [];

    if (req.files?.length !== 0) {
      // Upload to Cloudinary and get img url
      const images = req.files as Array<Express.Multer.File>;
      newImagesUrl = await Promise.all(
        images.map(async (img) => {
          const base64EncodedImage = Buffer.from(img.buffer).toString('base64');
          const dataUri = `data:${img.mimetype};base64,${base64EncodedImage}`;

          // Use the cloudinary uploader to upload the image
          const response = await cld.uploader.upload(dataUri, { folder: 'products' });
          return { id: response.public_id, url: response.secure_url };
        })
      );
    }

    // Then upload new product's data and image's url to product DB
    await productsModel.updateOneById(productData, newVariants, newImagesUrl);

    return res.status(200).send({
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

    const productData = await productsModel.getById(id);

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
    await productsModel.deleteOneById(id);

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
