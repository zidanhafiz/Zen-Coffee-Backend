import variantModel from '@/models/variantsModel';

// Function for get new variants product
export const getNewVariants = async (
  currentVariants: string[],
  dbVariants: Array<{ id: string; name: string }>
) => {
  // Create variable container
  const notDB: string[] = [];
  const inDB: Array<{ id: string; name: string }> = [];

  // Loop the current variants
  for (const cv of currentVariants) {
    // Loop the db variants
    for (let i = 0; i < dbVariants.length; i++) {
      // If current variant is already exist in DB then push into variable container (inDB)
      if (dbVariants[i].name.toLowerCase() === cv.toLowerCase()) {
        inDB.push(dbVariants[i]);
        break;
      }
      // If current variant is not exist on DB and it's in last index of db looping then push into variable container (notDB)
      if (i === dbVariants.length - 1) {
        notDB.push(cv);
      }
    }
  }

  // Insert the notDB variable into DB and return new array of that;
  const newNotDB = await Promise.all(
    notDB.map(async (v) => {
      return await variantModel.createOne(v);
    })
  );

  // Combine the newNotDB and inDB array and return the result
  const newVariants = newNotDB.concat(inDB);
  return newVariants;
};
