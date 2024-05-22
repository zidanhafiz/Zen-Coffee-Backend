import prisma from '@/db';

const getAll = async (productId: string) => {
  return await prisma.productImage.findMany({
    where: {
      productId,
    },
  });
};

const deleteAllByProductId = async (productId: string) => {
  return await prisma.productImage.deleteMany({
    where: {
      productId,
    },
  });
};

const deleteOneById = async (id: string) => {
  return await prisma.productImage.delete({
    where: {
      id,
    },
  });
};

export default { getAll, deleteAllByProductId, deleteOneById };
