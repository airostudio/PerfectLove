import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import ReadingViewer from "./ReadingViewer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function ReadingViewPage({ params }: PageProps) {
  const { orderId } = await params;

  const { data: order } = await getSupabase()
    .from("orders")
    .select("id, email, reading_id, reading_html, content_expires_at, status, image_url")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    notFound();
  }

  const isExpired =
    order.content_expires_at === null ||
    new Date(order.content_expires_at) < new Date();

  const daysRemaining =
    order.content_expires_at && !isExpired
      ? Math.ceil(
          (new Date(order.content_expires_at).getTime() - Date.now()) / 86400000
        )
      : 0;

  const readingId: string = order.reading_id ?? "";
  const title = readingId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  return (
    <ReadingViewer
      order={{
        id: order.id,
        reading_id: order.reading_id,
        reading_html: order.reading_html ?? null,
        content_expires_at: order.content_expires_at ?? null,
        status: order.status,
      }}
      daysRemaining={daysRemaining}
      isExpired={isExpired}
      title={title}
    />
  );
}
