import { useState, useEffect } from "react";
import axios from "axios";

const signs = [
  { name: "Aries", date: "Mar 21 - Apr 19" },
  { name: "Taurus", date: "Apr 20 - May 20" },
  { name: "Gemini", date: "May 21 - Jun 20" },
  { name: "Cancer", date: "Jun 21 - Jul 22" },
  { name: "Leo", date: "Jul 23 - Aug 22" },
  { name: "Virgo", date: "Aug 23 - Sep 22" },
  { name: "Libra", date: "Sep 23 - Oct 22" },
  { name: "Scorpio", date: "Oct 23 - Nov 21" },
  { name: "Sagittarius", date: "Nov 22 - Dec 21" },
  { name: "Capricorn", date: "Dec 22 - Jan 19" },
  { name: "Aquarius", date: "Jan 20 - Feb 18" },
  { name: "Pisces", date: "Feb 19 - Mar 20" },
];

export default function Horoscope() {
  const [horoscopes, setHoroscopes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoroscopes = async () => {
      try {
        const responses = await Promise.all(
          signs.map((sign) =>
            axios.get(
              `https://aztro.sameerkumar.website/?sign=${sign.name.toLowerCase()}&day=today`,
              {
                method: "POST",
              }
            )
          )
        );

        const horoscopeData = {};
        responses.forEach((response, index) => {
          horoscopeData[signs[index].name] = response.data;
        });

        setHoroscopes(horoscopeData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch horoscopes");
        setLoading(false);
      }
    };

    fetchHoroscopes();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Horoscope</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signs.map((sign) => (
          <div
            key={sign.name}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">{sign.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{sign.date}</p>
            {horoscopes[sign.name] && (
              <>
                <p className="text-gray-800 mb-4">
                  {horoscopes[sign.name].description}
                </p>
                <div className="text-sm text-gray-600">
                  <p>Compatibility: {horoscopes[sign.name].compatibility}</p>
                  <p>Mood: {horoscopes[sign.name].mood}</p>
                  <p>Lucky Number: {horoscopes[sign.name].lucky_number}</p>
                  <p>Lucky Time: {horoscopes[sign.name].lucky_time}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
