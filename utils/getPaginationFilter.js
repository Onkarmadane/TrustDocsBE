const getPaginationQuery = (
  page = 1,
  per_page = 10,
  defaultLimit = 10,
  maxLimit = 100,
  total = 0
) => {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(per_page, 10);

  const currentPage =
    isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const limit =
    isNaN(parsedLimit) || parsedLimit < 1
      ? defaultLimit
      : Math.min(parsedLimit, maxLimit);

  const skip = (currentPage - 1) * limit;

  const total_pages = Math.ceil(total / limit) || 1;

  return {
    page: currentPage,
    per_page: limit,
    total,
    total_pages,
    skip,
    has_next_page: currentPage < total_pages,
    has_prev_page: currentPage > 1,
  };
};

module.exports = { getPaginationQuery };
