"use strict";

/**
 * job service
 */

module.exports = ({ strapi }) => ({
  async find(params) {
    const { start = 0, limit = 3, ...rest } = params;
    try {
      const [entries, totalCount] = await Promise.all([
        strapi.entityService.findMany("api::job.job", {
          start,
          limit,
          ...rest,
        }),
        strapi.entityService.count("api::job.job", params),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage =
        Math.ceil(start / limit) + 1; /*cuurent page formular*/
      const hasPrevPage = currentPage > 1;
      const hasNextPage = currentPage < totalPages;

      return {
        entries,
        meta: {
          paginate: {
            totalCount,
            totalPages,
            currentPage,
            hasPrevPage,
            hasNextPage,
          },
        },
      };
    } catch (error) {
      strapi.log.error(error);
      throw error;
    }
  },
});
