import prisma from '@/db';
import { Product, productImg, Variant } from '@/types/constum';

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

export default { getAll, createOne };
