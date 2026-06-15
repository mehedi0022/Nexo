import slugify from "slugify";

export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    remove: undefined,
    strict: true,
    trim: true,
  });
};
