import { Request, Response } from 'express';
import usersModel from '@/models/users/usersModel';
import { matchedData, validationResult } from 'express-validator';
import { User } from '@/types/constum';

const getAll = async (req: Request, res: Response) => {
  try {
    const usersData = await usersModel.getAll();

    return res.status(200).send({
      message: 'Success get all users',
      data: usersData,
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

    const { id } = body;

    const usersData = await usersModel.getOneById(id);

    if (!usersData) return res.sendStatus(404);

    return res.status(200).send({
      message: 'Success get user',
      data: usersData,
    });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const createOne = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);

    const { id, username, firstName, lastName, email } = body;

    const userData: User = {
      id,
      username,
      fullName: firstName.concat(' ', lastName),
      email,
      role: 'USER',
    };

    await usersModel.createOne(userData);
    return res.status(201).send({ message: 'Success create new user' });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const updateOneFullName = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);

    const { id, firstName, lastName } = body;

    const userExist = await usersModel.getOneById(id);
    if (!userExist) return res.sendStatus(404);

    const userData = {
      fullName: firstName.concat(' ', lastName),
    };

    await usersModel.updateOne(id, userData);
    return res.status(200).send({ message: 'Success updated user' });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const updateOneEmail = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);

    const { id, email } = body;

    const userExist = await usersModel.getOneById(id);
    if (!userExist) return res.sendStatus(404);

    const userData = {
      email,
    };

    await usersModel.updateOne(id, userData);
    return res.status(200).send({ message: `Success updated user's email` });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};

const deleteOneById = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const body = matchedData(req);

    const { id } = body;

    const userExist = await usersModel.getOneById(id);
    if (!userExist) return res.sendStatus(404);

    await usersModel.deleteOneById(id);
    return res.status(200).send({ message: 'Success deleted user' });
  } catch (error) {
    return res.status(400).send({
      message: error,
    });
  }
};

export default {
  getAll,
  getOneById,
  createOne,
  updateOneFullName,
  updateOneEmail,
  deleteOneById,
};
