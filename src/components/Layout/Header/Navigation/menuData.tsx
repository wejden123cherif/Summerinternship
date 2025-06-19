import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "الدفع", href: "/payment" }, // Arabic for "Payment" - now on the left (end of RTL flow)
  { label: "الدورات", href: "/#courses" }, // Arabic for "Courses" - in the middle
  { label: "الرئيسية", href: "/" }, // Arabic for "Home" - now on the right (start of RTL flow)
];