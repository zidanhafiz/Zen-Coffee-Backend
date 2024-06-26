import prisma from '@/db';
import { Product, productImg, Variant } from '@/types/constum';
import { buildFilter } from '@/utils/helper';

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

const getAll = async (
  name: string,
  category: string,
  orderBy: string,
  sort: 'asc' | 'desc'
) => {
  const filter = buildFilter(name, category);

  if (Object.keys(filter).length === 0) {
    return await prisma.product.findMany({
      orderBy: {
        [orderBy]: sort,
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
  }

  return await prisma.product.findMany({
    where: filter,
    orderBy: {
      [orderBy]: sort,
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

const updateOneById = async (
  product: Product,
  variants: Variant[],
  images: productImg[]
) => {
  const createVariantsId = variants.map((v) => {
    return {
      variantId: v.id,
    };
  });

  if (images.length !== 0) {
    return await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        ...product,
        variants: {
          deleteMany: {
            productId: product.id,
          },
          create: createVariantsId,
        },
        images: {
          createMany: {
            data: images,
          },
        },
      },
    });
  }

  return await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      ...product,
      variants: {
        deleteMany: {
          productId: product.id,
        },
        create: createVariantsId,
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

export default { getAll, getById, createOne, deleteOneById, updateOneById };
