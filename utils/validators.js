export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      errors: ["Password is required"],
    };
  }

  if (typeof password !== "string") {
    return {
      isValid: false,
      errors: ["Password must be a string"],
    };
  }

  const requirements = {
    minLength: password.length >= 8,
  };

  const errorMessages = {
    minLength: "Password must be at least 8 characters long",
  };

  return {
    isValid: Object.values(requirements).every(Boolean),
    errors: Object.entries(requirements)
      .filter(([key, valid]) => !valid)
      .map(([key]) => errorMessages[key]),
  };
};
