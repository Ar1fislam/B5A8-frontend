import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Card className="border bg-card/70 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Cookie Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: Jan 19, 2026</p>
        </CardHeader>
        <CardContent className="space-y-6 text-sm leading-6 text-muted-foreground">
          <p>
            This Cookie Policy explains how cookies and similar technologies are used on TravelBuddy.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">What cookies are</h2>
            <p>
              Cookies are small text files stored in the browser to remember preferences and keep
              sessions working.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">How we use cookies</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Authentication (keeping users signed in).</li>
              <li>Security and abuse prevention.</li>
              <li>Preferences (theme, basic UI settings) if enabled.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Managing cookies</h2>
            <p>
              Cookies can be cleared or blocked in browser settings. Blocking cookies may affect login
              and other features.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
