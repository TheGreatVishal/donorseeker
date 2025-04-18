import prisma from "@/lib/prisma";

export async function logApiActivity({
  request,
  session,
  section,
  endpoint,
  requestType,
  statusCode,
  description,
}) {
  // console.log("📝 Starting API logging...");

  const ipAddress = request?.headers?.get?.("x-forwarded-for") || "Unknown";
  const userAgent = request?.headers?.get?.("user-agent") || "Unknown";
  const userEmail = session?.user?.email || null;

  // console.log("➡️  IP Address:", ipAddress);
  // console.log("➡️  User Email:", userEmail);
  // console.log("➡️  User Agent:", userAgent);

  let operatingSystem = "Unknown";
  let browser = "Unknown";

  if (userAgent !== "Unknown") {
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    operatingSystem = osMatch ? osMatch[1] : "Unknown";

    const browserMatch = userAgent.match(/(Firefox|Chrome|Safari|Edge|Opera|MSIE)\/[^\s]+/);
    browser = browserMatch ? browserMatch[0] : "Unknown";
  }

  // console.log("💻 Operating System:", operatingSystem);
  // console.log("🌐 Browser:", browser);

  let geoLocation = "Unknown";
  try {
    const res = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    // const res = await fetch(`https://ipwho.is/${ipAddress}`);
    const data = await res.json();
    console.log("Log activity: data: ", data);
    
    geoLocation = `${data.city}, ${data.country_name}`;
  } catch (error) {
    console.error("⚠️ Failed to fetch geolocation:", error);
  }

  // console.log("📍 Geo Location:", geoLocation);

  // Get current time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);

  // console.log("⏰ IST Timestamp:", istDate);

  try {
    await prisma.logging.create({
      data: {
        ipAddress,
        userEmail,
        section,
        apiEndpoint: endpoint,
        requestType,
        statusCode,
        description,
        timestamp: istDate,
        operatingSystem,
        browser,
        geoLocation,
      },
    });
    // console.log("✅ API activity logged successfully.");
  } catch (err) {
    console.error("❌ Failed to log API activity:", err);
  }
}
