import prisma from '@/db';
import { Bank } from '@/types/constum';

const getAll = async () => {
  return await prisma.bank.findMany();
};

const getOneById = async (id: string) => {
  return await prisma.bank.findUnique({
    where: {
      id,
    },
  });
};

const createOne = async (bank: Bank) => {
  return await prisma.bank.create({
    data: bank,
  });
};

const deleteOneById = async (id: string) => {
  return await prisma.bank.delete({
    where: {
      id,
    },
  });
};

export default { getAll, getOneById, createOne, deleteOneById };
