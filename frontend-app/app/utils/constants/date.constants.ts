const dayNames = {
  monday: "Astelehena",
  tuesday: "Asteartea",
  wednesday: "Asteazkena",
  thursday: "Osteguna",
  friday: "Ostirala",
  saturday: "Larunbata",
  sunday: "Igandea",
};

export const getDayName = (dateStr: string): string => {
  return dayNames[dateStr.toLowerCase() as keyof typeof dayNames] || dateStr;
};

const monthNames = {
  january: "Urtarrila",
  february: "Otsaila",
  march: "Martxoa",
  april: "Apirila",
  may: "Maiatza",
  june: "Ekaina",
  july: "Uztaila",
  august: "Abuztua",
  september: "Iraila",
  october: "Urria",
  november: "Azaroa",
  december: "Abendua",
};

export const getMonthName = (dateStr: string): string => {
  return (
    monthNames[dateStr.toLowerCase() as keyof typeof monthNames] || dateStr
  );
};
