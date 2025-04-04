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
  const ipAddress = request?.headers?.get?.("x-forwarded-for") || "Unknown";
  const userEmail = session?.user?.email || null;

  // Get current time in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);

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
    },
  });
}
