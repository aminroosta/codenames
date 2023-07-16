import Image from 'next/image'

export default function Home() {
  return (
    <Image
      src="/cards/card-0.svg"
      alt="Vercel Logo"
      className="dark:invert"
      width={400}
      height={96}
      priority
    />
  )
}
