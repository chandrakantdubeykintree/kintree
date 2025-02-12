export default function KincoinsEntryBanner() {
  return (
    <div className="w-full h-full flex items-center justify-center z-50">
      <div className="max-w-xl w-full">
        <img
          src="/kincoins/burst.svg"
          className="w-full h-auto"
          style={{
            animation: `
              scaleBounce 1s ease-in-out,
              fadeOut 1.5s ease-in-out 1.5s forwards
            `,
            transformOrigin: "center",
          }}
        />
      </div>
      <style jsx global>{`
        @keyframes scaleBounce {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
