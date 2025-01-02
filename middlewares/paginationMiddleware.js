import { asyncHandler } from "../utils/asyncHandler.js";

const paginationMiddleware = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.limit) || 1;

  if (page < 1 || perPage < 1) {
    return res
      .status(400)
      .json({ message: "Invalid page value or perPage value" });
  }

  const skip = (page - 1) * perPage;
  const take = perPage;

  req.pagination = { skip, take, page, perPage };
  next();
});

export { paginationMiddleware };
