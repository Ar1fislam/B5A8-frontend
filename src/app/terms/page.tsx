import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Card className="border bg-card/70 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Terms of Service</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: Jan 19, 2026</p>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <p>
            These Terms govern use of TravelBuddy. By using the site, users agree to follow these
            rules and applicable laws.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Accounts</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide accurate account information.</li>
              <li>Keep login credentials secure.</li>
              <li>Users are responsible for activity under their account.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Community guidelines</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>No harassment, hate, or illegal activity.</li>
              <li>No scams, spam, or misleading content.</li>
              <li>Respect privacy and safety when meeting others.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Content & visibility</h2>
            <p>
              Users control what they publish, but content shared publicly can be seen by others.
              TravelBuddy may remove content that violates these terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Support</h2>
            <p>
              For help, visit <Link className="text-primary hover:underline" href="/contact">Contact</Link>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
