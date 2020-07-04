export const createTransition = (event, check) => {
  return {
    _isMBTransition: true,
    event,
    check,
  };
};
