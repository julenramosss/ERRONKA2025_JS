import nextra from 'nextra';

const withNextra = nextra({
  defaultShowCopyCode: true,
  search: {
    codeblocks: false,
  },
  contentDirBasePath: '/',
});

export default withNextra({
  experimental: {
    viewTransition: true,
  },
  i18n: {
    locales: ['en', 'es', 'eus'],
    defaultLocale: 'en',
  },
});
