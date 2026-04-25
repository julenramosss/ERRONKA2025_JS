import nextra from "nextra";

const withNextra = nextra({
  defaultShowCopyCode: true,
  search: {
    codeblocks: false,
  },
  contentDirBasePath: "/",
});

export default withNextra({
  i18n: {
    locales: ["en", "es", "eus"],
    defaultLocale: "en",
  },
});
