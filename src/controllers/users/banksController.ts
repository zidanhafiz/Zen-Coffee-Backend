import { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';
import bankModel from '@/models/users/banksModel';
import { Bank } from '@/types/constum';

const getAll = async (req: Request, res: Response) => {
  try {
    const bankData = await bankModel.getAll();

    return res.status(200).send({
      message: 'Success get all banks',
      data: bankData,
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const getOneById = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);

    const bankData = await bankModel.getOneById(body.id);

    if (!bankData) return res.sendStatus(404);

    return res.status(200).send({
      message: 'Success get bank',
      data: bankData,
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const createOne = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body: Bank = matchedData(req);

    await bankModel.createOne(body);

    return res.status(201).send({ message: 'Success added a new bank account' });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const deleteOneById = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);

    const bankData = await bankModel.getOneById(body.id);

    if (!bankData) return res.sendStatus(404);

    await bankModel.deleteOneById(body.id);

    return res.status(200).send({
      message: 'Success deleted bank',
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

export default { getAll, getOneById, createOne, deleteOneById };
