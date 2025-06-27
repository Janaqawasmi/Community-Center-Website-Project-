import NProgress from 'nprogress';

export const withProgress = async (asyncFunction) => {
  NProgress.start();
  try {
    return await asyncFunction(); // call the function you pass in
  } finally {
    NProgress.done();
  }
};
