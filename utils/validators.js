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
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  const errorMessages = {
    minLength: "Password must be at least 8 characters long",
    hasUpper: "Password must contain an uppercase letter",
    hasLower: "Password must contain a lowercase letter",
    hasNumber: "Password must contain a number",
    hasSpecial: "Password must contain a special character (!@#$%^&*)",
  };

  return {
    isValid: Object.values(requirements).every(Boolean),
    errors: Object.entries(requirements)
      .filter(([key, valid]) => !valid)
      .map(([key]) => errorMessages[key]),
  };
};
