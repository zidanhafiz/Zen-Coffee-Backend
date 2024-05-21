import prisma from '@/db';

const createOne = async (variant: string) => {
  return await prisma.variant.create({
    data: {
      name: variant,
    },
  });
};

const getAll = async () => {
  return await prisma.variant.findMany();
};

export default { createOne, getAll };
