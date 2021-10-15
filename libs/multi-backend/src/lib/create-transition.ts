export const createTransition = (event: string, check: (event: Event|TouchEvent) => unknown) => {
  return {
    _isMBTransition: true,
    event,
    check,
  };
};
