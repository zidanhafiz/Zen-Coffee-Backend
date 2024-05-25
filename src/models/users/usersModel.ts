import prisma from '@/db';
import { User, UserUpdate } from '@/types/constum';

const getAll = async () => {
  return await prisma.user.findMany();
};

const getOneById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      address: true,
      banks: true,
      cart: true,
      wishlist: true,
      order: true,
    },
  });
};

const createOne = async (user: User) => {
  return await prisma.user.create({
    data: user,
  });
};

const updateOne = async (id: string, user: UserUpdate) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: user,
  });
};

const deleteOneById = async (id: string) => {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
};

export default { getAll, getOneById, createOne, updateOne, deleteOneById };
