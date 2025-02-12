import RedeemCard from "@/components/redeem-card";

const redeemKincoinsProduct = [
  {
    id: 1,
    name: "Genomepatri™ - The Ultimate",
    tag: "Mapmy genome",
    price: 7999,
    url: "/kincoins/genomepatri.png",
  },
  {
    id: 2,
    name: "BeautyMap™ - Skin & Hair Genetic",
    tag: "Mapmy genome",
    price: 6999,
    url: "/kincoins/beautymap.png",
  },
  {
    id: 3,
    name: "Myfitgene™ DNA Test Kit: 40+",
    tag: "Mapmy genome",
    price: 6999,
    url: "/kincoins/myfitgene.png",
  },
];

export default function RedeemKincoins() {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {redeemKincoinsProduct.map((item) => (
        <RedeemCard key={item.id} data={item} />
      ))}
    </div>
  );
}
