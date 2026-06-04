import campusBg from "../assets/campus-bg.jpg";

function PageBackground({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${campusBg})` }}
    >
      <div className="absolute inset-0 bg-blue-950/70"></div>

      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default PageBackground;