export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import NewAppointmentClient from "./NewAppointmentClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando…</p>}>
      <NewAppointmentClient />
    </Suspense>
  );
}
