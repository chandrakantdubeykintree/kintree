import RedeemCard from "@/components/redeem-card";

const redeemKincoinsProduct = [
  {
    id: 1,
    name: "Myfitgene™ DNA Test Kit: 40+",
    tag: "Mapmy genome",
    price: 6999,
    url: "/kincoinsImg/myfitgene.png",
  },
  {
    id: 2,
    name: "BeautyMap™ - Skin & Hair Genetic",
    tag: "Mapmy genome",
    price: 6999,
    url: "/kincoinsImg/beautymap.png",
  },
  {
    id: 3,
    name: "Genomepatri™ - The Ultimate",
    tag: "Mapmy genome",
    price: 7999,
    url: "/kincoinsImg/genomepatri.png",
  },
  {
    id: 4,
    name: "Genomepatri™ Heritage – DNA Ancestry Test",
    tag: "Mapmy genome",
    price: 7999,
    url: "/kincoinsImg/genomepatri-heritage.png",
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
