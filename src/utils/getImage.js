import { ENDPOINTIMG } from "../constants";

export const getImage = (photo) => {
  return `${ENDPOINTIMG}${photo?._id}.${photo?.name?.split(".")[1]}`;
};
