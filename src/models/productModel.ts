import prisma from '@/db';
import { Product, productImg, Variant } from '@/types/constum';

const createOne = async (product: Product, images: productImg[], variants: Variant[]) => {
  const createVariantsId = variants.map((v) => {
    return {
      variantId: v.id,
    };
  });

  return await prisma.product.create({
    data: {
      ...product,
      images: {
        createMany: {
          data: images,
        },
      },
      variants: {
        create: createVariantsId,
      },
    },
  });
};

const getAll = async () => {
  return await prisma.product.findMany({
    include: {
      images: true,
      variants: {
        select: {
          variant: true,
        },
      },
    },
  });
};

const getById = async (id: string) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      variants: {
        select: {
          variant: true,
        },
      },
    },
  });
};

const deleteOneById = async (id: string) => {
  return await prisma.product.delete({
    where: {
      id,
    },
  });
};

export default { getAll, getById, createOne, deleteOneById };
