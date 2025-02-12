export default function KincoinsEntryBanner() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-xl w-full">
        <img
          src="/kincoins/burst.svg"
          className="w-full h-auto"
          style={{
            animation: `
              scaleAndFade 3s ease-in-out
            `,
          }}
        />
      </div>
    </div>
  );
}
