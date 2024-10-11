import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p>
        <Link href={"/regi"}>レジ</Link>
      </p>
      <p>
        <Link href={"/slip"}>伝票</Link>
      </p>
    </main>
  );
}
