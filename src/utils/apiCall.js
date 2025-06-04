import { ErrorMessage, SuccessMessage } from "../helpers/common";
import { apiUrls } from "./apiUrls";
import { API } from "./apiUtils";

export const PostImage = async (body) => {
  try {
    const formData = new FormData();
    formData.append("tempImage", body)
    const apiResponse = await API(apiUrls.uploadImageArr, {}, "POST", formData);
    if (apiResponse.data.status) {
      return apiResponse.data.path
    }
    else {
      ErrorMessage(apiResponse?.data?.message)
    }

  }
  catch (err) {
    ErrorMessage(err?.message)
  }
}

export const PostImageMultiple = async (imgArr) => {
  
  const formData = new FormData();
    imgArr.forEach((image) => {
      console.log("Image ", image)
      formData.append('tempImage', image);
    });
  try {
    const apiResponse = await API(apiUrls.uploadImageArr, {}, "POST", formData);
    if (apiResponse.data.status) {
      return apiResponse.data.path
    }
    else {
      ErrorMessage(apiResponse?.data?.message)
    }
  }
  catch (err) {
    ErrorMessage(err?.message)
  }
}
export const PostImageMultipleMenu = async (imgArr) => {
  
  const formData = new FormData();
    imgArr.forEach((image) => {
      console.log("Image ", image)
      formData.append('tempImage', image);
    });
  try {
    const apiResponse = await API(apiUrls.multiUploadImage, {}, "POST", formData);
    console.log("apiResponse", apiResponse);
    console.log("apiResponse.data.data", apiResponse.data.data);
    if (apiResponse.data.status) {
      return apiResponse.data.data
    }
    else {
      ErrorMessage(apiResponse?.data?.message)
    }
  }
  catch (err) {
    ErrorMessage(err?.message)
  }
}
