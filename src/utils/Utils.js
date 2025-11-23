import PersonIcon from '@mui/icons-material/Person';

// Cache for profile images to prevent rate limiting (429 errors)
const imageCache = new Map();

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

  const pictureUrl = userSessionDetails.pictureUrl;

  // If no picture URL or it's empty, show fallback immediately
  if (!pictureUrl || pictureUrl === "") {
    return <PersonIcon fontSize='large' />;
  }

  // Check if this URL has previously failed to load (to prevent rate limiting)
  if (imageCache.has(pictureUrl) && imageCache.get(pictureUrl) === 'failed') {
    return <PersonIcon fontSize='large' />;
  }

  // Show user image with error fallback
  return (
    <>
      <img
        src={pictureUrl}
        alt='User profile'
        onLoad={(e) => {
          // Mark as successfully loaded in cache
          imageCache.set(pictureUrl, 'success');
        }}
        onError={(e) => {
          // Cache this URL as failed to prevent future requests
          imageCache.set(pictureUrl, 'failed');

          // Hide the broken image and show the fallback icon
          e.target.style.display = 'none';
          const fallbackIcon = e.target.parentElement.querySelector('.fallback-icon');
          if (fallbackIcon) {
            fallbackIcon.style.display = 'block';
          }
        }}
      />
      <PersonIcon
        fontSize='large'
        className='fallback-icon'
        style={{ display: 'none' }}
      />
    </>
  );
}