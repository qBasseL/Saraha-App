export const findOne = async ({
  model,
  filter = {},
  select = "",
  populate = [],
  options = {}
} = {}) => {
    let query = model.findOne(filter, null, options).select(select);

    if(populate) {
        if (Array.isArray(populate)) {
            populate.forEach((pop) => {
                query = query.populate(pop)
            })
        } else {
            query = query.populate(populate)
        }
    }

    return await query
};
