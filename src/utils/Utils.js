import PersonIcon from '@mui/icons-material/Person';

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
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    maxHeight: '100px',
    // Make it scrollable vertically when content overflows.
    overflowY: 'auto',
    flexWrap: 'wrap',
    paddingRight: '2px', // Drastically reduce the default padding on the right
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    padding: '2px 4px', // The default is 8px, this makes it much tighter
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: '2px 4px', // Keep it consistent with the clear indicator
  }),
  control: (provided, state) => ({
    ...provided,
    // ... other control styles
    alignItems: 'flex-start', // Align items to the top
  }),
};

export function renderUserImage(userSessionDetails) {
  if (userSessionDetails.pictureUrl !== null && userSessionDetails.pictureUrl !== "") {
    // Show user image
    return (
      <img src={userSessionDetails.pictureUrl} alt=''></img>
    )
  } else {
    return (
      <PersonIcon fontSize='large' />
    )
  }
}