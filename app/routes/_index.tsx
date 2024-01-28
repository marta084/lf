import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

export const loader = async ({ context }: LoaderFunctionArgs) => {
  console.log(context.env.HONEYPOT_SECRET)
  console.log(context.env.DATABASE_URL)

  return null
}

export default function Index() {
  return (
    <div className="mb-auto">
      <div>
        <h1 className="text-blue-500">Welcome to marta Blog & Notes</h1>
        <div></div>
        <Link to="https://google.com">text go to google</Link>
        <a href="http://"> link</a>
      </div>
    </div>
  )
}
