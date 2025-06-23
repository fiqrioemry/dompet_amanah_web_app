import { FindAndCountOptions, ModelStatic } from "sequelize";

/**
 * Reusable Sequelize pagination utility
 * @param model Sequelize model
 * @param options Query options (filter, include, etc.)
 * @param pageStr req.query.page (optional)
 * @param limitStr req.query.limit (optional)
 */
export async function paginate<T>(
  model: ModelStatic<any>,
  options: FindAndCountOptions = {},
  pageStr?: string,
  limitStr?: string
) {
  const page = parseInt(pageStr || "1", 10) || 1;
  const limit = parseInt(limitStr || "10", 10) || 10;
  const offset = (page - 1) * limit;

  const { count, rows } = await model.findAndCountAll({
    ...options,
    offset,
    limit,
  });

  return {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
}
