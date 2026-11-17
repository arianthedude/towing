import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ fontFamily: "Tahoma, sans-serif", padding: 40 }}>
        <h1>صفحه پیدا نشد / Not found</h1>
        <p>
          <Link href="/">بازگشت به خانه</Link> · <Link href="/en">Home (EN)</Link>
        </p>
      </body>
    </html>
  );
}
