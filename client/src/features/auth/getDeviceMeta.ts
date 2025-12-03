import type { DeviceMeta } from "./types";

function getBrowserName(userAgent: string) {
  if (userAgent.includes("Edg")) return "Microsoft Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera";
  return "Unknown Browser";
}

function getOSName(userAgent: string) {
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "MacOS";
  if (/Linux|Ubuntu|Fedora|Debian/i.test(userAgent)) return "Linux";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iOS/i.test(userAgent)) return "iOS";
  return "Unknown OS";
}
async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "Unknown IP";
  }
}

async function getLocation(ip: string) {
  const res = await fetch(`https://ipwho.is/${ip}`);
  const data = await res.json();

  return {
    country: data.country ?? null,
    region: data.region ?? null,
    city: data.city ?? null,
    lat: data.latitude ?? null,
    lon: data.longitude ?? null,
  };
}

export async function getDeviceMeta(): Promise<DeviceMeta> {
  const userAgent = navigator.userAgent;
  const ip = await getPublicIP();
  const location = await getLocation(ip);

  return {
    ipAddress: await getPublicIP(),
    broswerInfo: getBrowserName(userAgent),
    osInfo: getOSName(userAgent),
    userAgent,
    deviceName: `${getBrowserName(userAgent)} on ${getOSName(userAgent)}`,
    location: location || "Unknown location",
  };
}
