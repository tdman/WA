// src/components/BackgroundImage.js

const BackgroundImage = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url('/../../public/ttoro.png')`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      opacity: 0.6,
      zIndex: -1,
      pointerEvents: 'none'
    }} />
  );
};

export default BackgroundImage;
