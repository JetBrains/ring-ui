module.exports = {
  async preVisit(page) {
    if (process.env.DARK) {
      await page.emulateMedia({colorScheme: 'dark'});
      // await page.waitForTimeout(CSS_TRANSITION_DURATION);
    }
  },
  tags: {skip: ['skip-test']},
};
