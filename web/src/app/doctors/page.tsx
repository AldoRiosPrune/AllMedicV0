export const dynamic = "force-dynamic";
export const revalidate = 0;

import DoctorsClient from "./DoctorsClient";

export default function Page() {
  return <DoctorsClient />;
}
