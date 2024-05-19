import { Request, Response } from 'express';

const getAll = async (req: Request, res: Response) => {
  return res.send({
    data: [
      {
        id: 1,
        name: 'Sabun',
      },
      {
        id: 2,
        name: 'Odol',
      },
    ],
  });
};

export default { getAll };
