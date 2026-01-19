import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Card className="border bg-card/70 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: Jan 19, 2026</p>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <p>
            This Privacy Policy explains how TravelBuddy collects, uses, and protects information
            when using the website and services.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Information collected</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Account information (name, email, password) when registering.</li>
              <li>Profile and trip-plan details entered to use matching features.</li>
              <li>Basic usage data to improve performance and prevent abuse.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">How information is used</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide login, profiles, plans, and matching.</li>
              <li>Maintain security, detect fraud, and debug issues.</li>
              <li>Improve features and user experience.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Sharing</h2>
            <p>
              Profile content may be visible to other users depending on feature settings. Payment
              processing (if enabled) may involve third-party providers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Contact</h2>
            <p>
              Questions? Use the <Link className="text-primary hover:underline" href="/contact">contact page</Link>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
