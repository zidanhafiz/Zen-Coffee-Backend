import { Request, Response } from 'express';
import images from '@/models/products/imagesModel';
import { matchedData, validationResult } from 'express-validator';

const getAll = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const params = matchedData(req);

    const { productId } = params;

    const imagesData = await images.getAll(productId);

    return res.status(200).send({
      message: `Success get all product's images`,
      data: imagesData,
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

export default { getAll };
