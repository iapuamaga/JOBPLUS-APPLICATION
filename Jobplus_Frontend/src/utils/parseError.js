export const parseError = (err) => {
  if (err?.response?.data?.error?.name === "ValidationError") {
    return {
      message: err?.response?.data?.error?.message,
      details: err?.response?.data?.error?.details?.errors,
    };
  }
  if (err?.message === "Network Error") {
    return {
      message: "unable to connect to the server end point provided",
      details: [],
    };
  }
  if (err?.response?.request?.status === 403) {
    return {
      message: "Your role does not have access to this resource",
      details: [],
    };
  }

  return {
    message: "An unexpected error occured contact support",
    details: [],
  };
};
