const resolveUrl = (typename, urlSlug) => {
  switch (typename) {
    case "kontent_item_person":
      return `/people/${urlSlug}`;
    case "kontent_item_website":
      return `/websites/${urlSlug}`;
    case "kontent_item_repository":
      return `/repositories/${urlSlug}`;
    default:
      return `/404`;
  }
};


module.exports = {
  resolveUrl
}