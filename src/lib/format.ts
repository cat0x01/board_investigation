export function formatDate(value?: string | Date | null) {
  if (!value) return "Unscheduled";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function priorityTone(priority: string) {
  if (priority === "Critical") return "text-red-200 border-red-500/40 bg-red-500/15";
  if (priority === "High") return "text-orange-200 border-orange-500/40 bg-orange-500/15";
<<<<<<< HEAD
  if (priority === "Medium") return "text-amber-100 border-amber-500/40 bg-amber-500/15";
  return "text-amber-100 border-amber-500/40 bg-amber-500/15";
=======
  if (priority === "Medium") return "text-cyan-100 border-cyan-500/40 bg-cyan-500/15";
  return "text-emerald-100 border-emerald-500/40 bg-emerald-500/15";
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
