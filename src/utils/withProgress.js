import NProgress from 'nprogress';

export const withProgress = async (asyncFunc) => {
  NProgress.start();
  try {
    return await asyncFunc();
  } finally {
    NProgress.done();
  }
};
