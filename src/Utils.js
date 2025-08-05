export const customStyleForSelectPlacement = {
  control: (provided) => ({
    ...provided,
    fontFamily: '"Inter", sans-serif',
    fontSize: '14px'
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    fontFamily: '"Inter", sans-serif',
    fontSize: '14px'
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
    fontFamily: '"Inter", sans-serif',
    fontSize: '14px'
  }),
  menuList: (provided) => ({
    ...provided,
    fontFamily: '"Inter", sans-serif',
    fontSize: '14px'
  })
};